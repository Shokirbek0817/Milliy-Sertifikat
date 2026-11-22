// TO'G'RI JAVOBLAR //
const togriJavoblar = [
  "C", // 1-savol
  "A", // 2-savol
  "D", // 3-savol
  "A", // 4-savol
  "D", // 5-savol
  "B", // 6-savol
  "C", // 7-savol
  "C", // 8-savol
  "D", // 9-savol
  "D", // 10-savol
  "A", // 11-savol
  "B", // 12-savol
  "C", // 13-savol
  "A", // 14-savol
  "D", // 15-savol
  "B", // 16-savol
  "D", // 17-savol
  "C", // 18-savol
  "D", // 19-savol
  "C", // 20-savol
  "A", // 21-savol
  "A", // 22-savol
  "D", // 23-savol
  "D", // 24-savol
  "A", // 25-savol
  "A", // 26-savol
  "D", // 27-savol
  "A", // 28-savol
  "B", // 29-savol
  "C", // 30-savol
  "B", // 31-savol
  "A", // 32-savol
  "D", // 33-savol
  "C", // 34-savol
  "A"  // 35-savol
];

const togriOchiq = [
  ["2", "-0.5"],          // 36-savol
  ["1", "10"],            // 37-savol
  ["0.75", "2.25"],       // 38-savol
  ["4", "3π/2"],          // 39-savol
  ["12", "36"],           // 40-savol
  ["72√3", "72"],         // 41-savol
  ["8+2√17", "16"],       // 42-savol
  ["4.8", "2.88"],        // 43-savol
  ["216", "4"],           // 44-savol
  ["4", "192"]            // 45-savol
];

const savollar = document.querySelectorAll(".orqafon");
const ochiqSavollar = document.querySelectorAll(".ochiq");
const yakunBtn = document.getElementById("yakunlash");
const oyna = document.getElementById("natija-oyna");
const yopishBtn = document.getElementById("yopish");

let yakunlandi = false;

// HAR QANDAY ILDIZ, PI, VERGUL VA BO'SHLIQLARNI BIR XIL FORMATGA KELTIRUVCHI FUNKSIYA
function tozala(matn) {
  return matn
    .toLowerCase()
    .replace(/[\s\u200B-\u200D\uFEFF]/g, "")   // Oddiy va ko'rinmas bo'shliqlarni o'chiradi
    .replace(/,/g, ".")                        // Vergulni nuqtaga aylantiradi
    .replace(/[\u221A\u221B\u221C√]/g, "sqrt") // Har qanday ildiz belgisini "sqrt" ga aylantiradi
    .replace(/sqrt\((\d+)\)/g, "sqrt$1")       // sqrt(3) ni sqrt3 ga aylantiradi
    .replace(/[\u03C0\u1D28π]/g, "pi");        // Har qanday pi belgisini "pi" ga aylantiradi
}

function darajaniTopish(ball) {
  if (ball >= 46) return "A+";
  if (ball >= 41) return "A";
  if (ball >= 36) return "B+";
  if (ball >= 31) return "B";
  if (ball >= 26) return "C+";
  if (ball >= 20) return "C";
  return "Sertifikat berilmadi";
}

savollar.forEach(function (savol) {
  const tugmalar = savol.querySelectorAll(".kalit button");

  tugmalar.forEach(function (tugma) {
    tugma.addEventListener("click", function () {
      if (yakunlandi) return;

      tugmalar.forEach(function (t) {
        t.classList.remove("tanlangan");
      });

      tugma.classList.add("tanlangan");
    });
  });
});

yopishBtn.addEventListener("click", function () {
  oyna.classList.remove("korinadi");
});

yakunBtn.addEventListener("click", function () {
  if (yakunlandi) {
    oyna.classList.add("korinadi");
    return;
  }

  yakunlandi = true;

  let testTogri = 0;
  let testXato = 0;
  let testBosh = 0;

  let ochiqTogri = 0;
  let ochiqXato = 0;
  let ochiqBosh = 0;

  savollar.forEach(function (savol, index) {
    const togriJavob = togriJavoblar[index];
    const tugmalar = savol.querySelectorAll(".kalit button");
    const tanlangan = savol.querySelector(".kalit button.tanlangan");

    if (!tanlangan) {
      testBosh++;
    } else if (tanlangan.textContent.trim() === togriJavob) {
      testTogri++;
    } else {
      testXato++;
      tanlangan.classList.add("xato");
    }

    tugmalar.forEach(function (t) {
      if (t.textContent.trim() === togriJavob) {
        t.classList.add("togri");
      }
    });
  });

  ochiqSavollar.forEach(function (savol, i) {
    const kataklar = savol.querySelectorAll(".javob");

    kataklar.forEach(function (katak, j) {
      const togriJavob = togriOchiq[i][j];
      const izoh = katak.nextElementSibling;
      const yozilgan = tozala(katak.value);

      katak.disabled = true;

      if (yozilgan === "") {
        ochiqBosh++;
        izoh.textContent = "To'g'ri javob: " + togriJavob;
      } else if (yozilgan === tozala(togriJavob)) {
        ochiqTogri++;
        katak.classList.add("togri");
      } else {
        ochiqXato++;
        katak.classList.add("xato");
        izoh.textContent = "To'g'ri javob: " + togriJavob;
      }
    });
  });

  const jami = testTogri + ochiqTogri;
  const daraja = darajaniTopish(jami);

  document.getElementById("n-test").textContent =
    "Test: " + testTogri + " to'g'ri, " + testXato + " xato, " + testBosh + " belgilanmagan";

  document.getElementById("n-ochiq").textContent =
    "Ochiq: " + ochiqTogri + " to'g'ri, " + ochiqXato + " xato, " + ochiqBosh + " yozilmagan";

  document.getElementById("n-jami").textContent = "Jami: " + jami;
  document.getElementById("n-daraja").textContent = "Daraja: " + daraja;

  oyna.classList.add("korinadi");
});