const canvas = document.getElementById("dimCanvas");
const ctx = canvas.getContext("2d");

const velSlider = document.getElementById("vel-slider");
const velVal = document.getElementById("vel-val");
const xyzVal = document.getElementById("xyz-val");
const xyztVal = document.getElementById("xyzt-val");
const ctVal = document.getElementById("ct-val");
const tauVal = document.getElementById("tau-val");

const preset0Btn = document.getElementById("preset-0");
const preset80Btn = document.getElementById("preset-80");
const resetBtn = document.getElementById("reset-btn");

let width, height;
function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

// Fizika holati
let beta = 0.0;        // v / c (0..0.99)
let ct = 0;            // 4-o'lcham koordinata vaqti
let tau = 0;           // Xususiy vaqt (proper time)
let pos3D = { x: 0, y: 0, z: 0 };
let path3D = [];       // 3D fazodagi iz
let worldline4D = [];  // 4D fazo-vaqtdagi dunyo chizig'i
let camAngle = 0.55;

velSlider.addEventListener("input", (e) => {
  beta = parseFloat(e.target.value);
  velVal.textContent = `${beta.toFixed(2)} c`;
});

preset0Btn.addEventListener("click", () => {
  beta = 0.0;
  velSlider.value = "0.00";
  velVal.textContent = "0.00 c";
});

preset80Btn.addEventListener("click", () => {
  beta = 0.80;
  velSlider.value = "0.80";
  velVal.textContent = "0.80 c";
});

function resetSim() {
  ct = 0;
  tau = 0;
  pos3D = { x: 0, y: 0, z: 0 };
  path3D = [{ x: 0, y: 0, z: 0 }];
  worldline4D = [{ x: 0, ct: 0 }];
}

resetBtn.addEventListener("click", resetSim);
resetSim();

// 3D (X, Y, Z) nuqtani chap panel markaziga proyeksiyalash
function project3DAxis(x, y, z, centerX, centerY, angle) {
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);

  // Y o'qi atrofida burish
  const rx = x * cosA - z * sinA;
  const rz = z * cosA + x * sinA;

  // Yuqoridan biroz qiyalatish
  const tilt = 0.42;
  const ry = y * Math.cos(tilt) - rz * Math.sin(tilt);
  const finalZ = rz * Math.cos(tilt) + y * Math.sin(tilt);

  const fov = 420;
  const scale = fov / Math.max(120, fov + finalZ + 180);

  return {
    sx: centerX + rx * scale,
    sy: centerY + ry * scale,
    scale
  };
}

function drawAxisLine(from, to, color, label, labelOffsetX = 6, labelOffsetY = -6) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(from.sx, from.sy);
  ctx.lineTo(to.sx, to.sy);
  ctx.stroke();

  // Strelka uchi
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(to.sx, to.sy, 3.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = "700 13px system-ui, sans-serif";
  ctx.fillText(label, to.sx + labelOffsetX, to.sy + labelOffsetY);
  ctx.restore();
}

function drawLeft3DSpace(leftCx, leftCy) {
  const axisLen = 115;

  // Sarlavha
  ctx.fillStyle = "#94a3b8";
  ctx.font = "600 13px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("3D FAZO O‘QLARI (X, Y, Z)", leftCx, 44);
  ctx.textAlign = "left";

  const o = project3DAxis(0, 0, 0, leftCx, leftCy, camAngle);
  const xEnd = project3DAxis(axisLen, 0, 0, leftCx, leftCy, camAngle);
  const yEnd = project3DAxis(0, -axisLen, 0, leftCx, leftCy, camAngle);
  const zEnd = project3DAxis(0, 0, axisLen, leftCx, leftCy, camAngle);

  // Yerdagi (X-Z) maydon to'ri
  ctx.strokeStyle = "rgba(148, 163, 184, 0.14)";
  ctx.lineWidth = 1;
  for (let g = -80; g <= 80; g += 40) {
    const p1 = project3DAxis(g, 0, -80, leftCx, leftCy, camAngle);
    const p2 = project3DAxis(g, 0, 80, leftCx, leftCy, camAngle);
    ctx.beginPath();
    ctx.moveTo(p1.sx, p1.sy);
    ctx.lineTo(p2.sx, p2.sy);
    ctx.stroke();

    const p3 = project3DAxis(-80, 0, g, leftCx, leftCy, camAngle);
    const p4 = project3DAxis(80, 0, g, leftCx, leftCy, camAngle);
    ctx.beginPath();
    ctx.moveTo(p3.sx, p3.sy);
    ctx.lineTo(p4.sx, p4.sy);
    ctx.stroke();
  }

  // X, Y, Z o'qlari
  drawAxisLine(o, xEnd, "#f87171", "+X", 8, 4);
  drawAxisLine(o, yEnd, "#4ade80", "+Y", 8, 4);
  drawAxisLine(o, zEnd, "#60a5fa", "+Z", 8, 14);

  // 3D fazodagi harakat izi
  if (path3D.length > 1) {
    ctx.strokeStyle = "rgba(56, 189, 248, 0.7)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < path3D.length; i++) {
      const pt = project3DAxis(path3D[i].x, path3D[i].y, path3D[i].z, leftCx, leftCy, camAngle);
      if (i === 0) ctx.moveTo(pt.sx, pt.sy);
      else ctx.lineTo(pt.sx, pt.sy);
    }
    ctx.stroke();
  }

  // Sening 3D fazodagi nuqtang
  const me3D = project3DAxis(pos3D.x, pos3D.y, pos3D.z, leftCx, leftCy, camAngle);
  ctx.fillStyle = "#38bdf8";
  ctx.beginPath();
  ctx.arc(me3D.sx, me3D.sy, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1.8;
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "600 12px system-ui, sans-serif";
  ctx.fillText("SIZ (X, Y, Z)", me3D.sx + 10, me3D.sy - 8);
}

function drawRight4DSpacetime(rightCx, rightCy) {
  const baseY = rightCy + 110;
  const len = 185;

  ctx.fillStyle = "#94a3b8";
  ctx.font = "600 13px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("4-O‘LCHAM: FAZO (x) VA VAQT (ct)", rightCx, 44);
  ctx.textAlign = "left";

  // Yorug'lik konusi (45 gradus: x = ±ct, bu yerda foton uchun τ = 0)
  ctx.save();
  const coneGrad = ctx.createLinearGradient(rightCx, baseY, rightCx, baseY - len);
  coneGrad.addColorStop(0, "rgba(250, 204, 21, 0.2)");
  coneGrad.addColorStop(1, "rgba(250, 204, 21, 0.02)");
  ctx.fillStyle = coneGrad;
  ctx.beginPath();
  ctx.moveTo(rightCx, baseY);
  ctx.lineTo(rightCx - len, baseY - len);
  ctx.lineTo(rightCx + len, baseY - len);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "rgba(250, 204, 21, 0.85)";
  ctx.setLineDash([5, 4]);
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(rightCx - len, baseY - len);
  ctx.lineTo(rightCx, baseY);
  ctx.lineTo(rightCx + len, baseY - len);
  ctx.stroke();
  ctx.restore();

  // Fazo (x) va 4-o'lcham Vaqt (ct) o'qlari
  ctx.strokeStyle = "rgba(148, 163, 184, 0.6)";
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(rightCx - len - 15, baseY);
  ctx.lineTo(rightCx + len + 15, baseY);
  ctx.moveTo(rightCx, baseY + 20);
  ctx.lineTo(rightCx, baseY - len - 20);
  ctx.stroke();

  ctx.fillStyle = "#e2e8f0";
  ctx.font = "600 12px system-ui, sans-serif";
  ctx.fillText("4D Vaqt o‘qi (ct)", rightCx + 8, baseY - len - 8);
  ctx.fillText("Fazo (x)", rightCx + len - 28, baseY + 16);

  ctx.fillStyle = "#facc15";
  ctx.fillText("Foton (τ = 0)", rightCx + len * 0.52, baseY - len * 0.62);

  // Sening 4D dunyo chizig'ing (worldline)
  if (worldline4D.length > 1) {
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    for (let i = 0; i < worldline4D.length; i++) {
      const px = rightCx + worldline4D[i].x * 0.65;
      const py = baseY - worldline4D[i].ct * 0.65;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }

  // Foton nuqtasi (4-o'lchamda o'z vaqti 0 da turadi)
  const phX = rightCx + ct * 0.65;
  const phY = baseY - ct * 0.65;
  ctx.fillStyle = "#facc15";
  ctx.beginPath();
  ctx.arc(phX, phY, 5.5, 0, Math.PI * 2);
  ctx.fill();

  // Sening 4D nuqtang
  const meX = rightCx + pos3D.x * 0.65;
  const meY = baseY - ct * 0.65;
  ctx.fillStyle = "#38bdf8";
  ctx.beginPath();
  ctx.arc(meX, meY, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1.8;
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.fillText(`SIZ (τ = ${(tau * 0.1).toFixed(1)})`, meX + 10, meY - 6);
}

function update() {
  camAngle += 0.005;

  const dct = 0.85;
  const invGamma = Math.sqrt(Math.max(0, 1 - beta * beta));

  ct += dct;
  tau += dct * invGamma;

  // Fazodagi siljish (3D yo'nalishda)
  const stepDist = beta * dct * 1.15;
  pos3D.x += stepDist * 0.8;
  pos3D.y -= stepDist * 0.25;
  pos3D.z += stepDist * 0.45;

  path3D.push({ ...pos3D });
  worldline4D.push({ x: pos3D.x, ct });

  if (ct * 0.65 > 175) {
    resetSim();
  }

  const s = 0.1;
  const sx = (pos3D.x * s).toFixed(1);
  const sy = (pos3D.y * s).toFixed(1);
  const sz = (pos3D.z * s).toFixed(1);
  const sct = (ct * s).toFixed(1);

  xyzVal.textContent = `(${sx}, ${sy}, ${sz})`;
  xyztVal.textContent = `(${sx}, ${sy}, ${sz}, ${sct})`;
  ctVal.textContent = (ct * s).toFixed(2);
  tauVal.textContent = (tau * s).toFixed(2);
}

function loop() {
  requestAnimationFrame(loop);
  update();

  ctx.fillStyle = "#040712";
  ctx.fillRect(0, 0, width, height);

  const isWide = width >= 820;
  const leftCx = isWide ? width * 0.42 : width * 0.5;
  const leftCy = isWide ? height * 0.58 : height * 0.48;
  const rightCx = isWide ? width * 0.78 : width * 0.5;
  const rightCy = isWide ? height * 0.52 : height * 0.78;

  if (isWide) {
    ctx.strokeStyle = "rgba(148, 163, 184, 0.12)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width * 0.60, 24);
    ctx.lineTo(width * 0.60, height - 24);
    ctx.stroke();
  }

  drawLeft3DSpace(leftCx, leftCy);
  drawRight4DSpacetime(rightCx, rightCy);
}

loop();