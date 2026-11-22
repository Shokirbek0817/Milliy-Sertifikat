// TO'G'RI JAVOBLAR //
const togriJavoblar = [
  "C", // 1-savol
  "A", // 2-savol
  "B", // 3-savol
  "C", // 4-savol
  "B", // 5-savol
  "A", // 6-savol
  "A", // 7-savol
  "D", // 8-savol
  "B", // 9-savol
  "B", // 10-savol
  "B", // 11-savol
  "B", // 12-savol
  "A", // 13-savol
  "D", // 14-savol
  "A", // 15-savol
  "C", // 16-savol
  "C", // 17-savol
  "A", // 18-savol
  "B", // 19-savol
  "A", // 20-savol
  "D", // 21-savol
  "C", // 22-savol
  "B", // 23-savol
  "B", // 24-savol
  "A", // 25-savol
  "A", // 26-savol
  "B", // 27-savol
  "C", // 28-savol
  "A", // 29-savol
  "D", // 30-savol
  "D", // 31-savol
  "C", // 32-savol
  "C", // 33-savol
  "D", // 34-savol
  "C"  // 35-savol
];

const togriOchiq = [
  ["4", "8"],                   // 36-savol
  ["60/289", "13/12"],          // 37-savol
  ["p^2/96", "3/7"],            // 38-savol
  ["10", "7/18"],               // 39-savol
  ["3√15/2", "7/16"],           // 40-savol
  ["-2", "2√2"],                // 41-savol
  ["π/2", "17π/18"],            // 42-savol
  ["14√30", "2√30/3"],          // 43-savol
  ["648√3", "864√3"],           // 44-savol
  ["1", "4/9"]                  // 45-savol
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