// 1. To'g'ri javoblar bazasini tuzamiz (bularni o'zingizning to'g'ri javoblaringizga qarab o'zgartirasiz)
const togriJavoblar = {
    1: "A",
    2: "B",
    3: "C",
    4: "D",
    5: "A",
     6: "A",
     7: "A",
     8: "A",
     9: "A",
      10: "A",
     11: "A",
     12: "A",
     13: "A",
     14: "A",
     15: "A",
     16: "A",
     17: "A",
     18: "A",
     19: "A",
     20: "A",
     21: "A",
     22: "A",
     23: "A",
     24: "A",
     25: "A",
     26: "A",
     27: "A",
     28: "A",
     29: "A",
     30: "A",
     31: "A",
     32: "A",
     33: "A",
     34: "A",
     35: "A"

    // ... 35-savolgacha davom ettirasiz
};

// 2. Foydalanuvchi tanlagan javoblarni saqlash uchun obyekt
const foydalanuvchiJavoblari = {};

// Barcha kalit (A, B, C, D) tugmalarini olamiz
const kalitBoutons = document.querySelectorAll('.kalit');

kalitBoutons.forEach(button => {
    button.addEventListener('click', () => {
        // Qaysi savolga tegishli ekanini topamiz
        const savolDiv = button.closest('.kiritilgan-javob');
        const savolRaqami = savolDiv.getAttribute('data-question');
        const tanlanganJavob = button.getAttribute('data-answer');

        // Shu savoldagi boshqa tugmalardan 'selected' klassini olib tashlaymiz
        savolDiv.querySelectorAll('.kalit').forEach(btn => {
            btn.classList.remove('selected');
        });

        // Bosilgan tugmaga 'selected' klassini qo'shamiz
        button.classList.add('selected');

        // Foydalanuvchi javobini saqlaymiz
        foydalanuvchiJavoblari[savolRaqami] = tanlanganJavob;
    });
});

// 3. "Tekshirish" tugmasi bosilgandagi amal
const tekshirishBtn = document.querySelector('.tekshirish');

tekshirishBtn.addEventListener('click', () => {
    const savolBlocklari = document.querySelectorAll('.kiritilgan-javob');

    savolBlocklari.forEach(savolDiv => {
        const savolRaqami = savolDiv.getAttribute('data-question');
        const foydalanuvchiTanlovi = foydalanuvchiJavoblari[savolRaqami];
        const togriJavob = togriJavoblar[savolRaqami];

        const tugmalar = savolDiv.querySelectorAll('.kalit');

        tugmalar.forEach(btn => {
            const btnJavob = btn.getAttribute('data-answer');

            // Agar bu tugma to'g'ri javob bo'lsa - yashil qilamiz
            if (btnJavob === togriJavob) {
                btn.classList.add('correct');
            }

            // Agar foydalanuvchi tanlagan javob xato bo'lsa - qizil qilamiz
            if (btnJavob === foydalanuvchiTanlovi && foydalanuvchiTanlovi !== togriJavob) {
                btn.classList.add('wrong');
            }
        });
    });

    alert("Test tekshirildi! To'g'ri va xato javoblar belgilandi.");
});
tekshirishBtn.addEventListener('click', () => {
    let togriSoni = 0;
    let xatoSoni = 0;
    let belgilanmaganSoni = 0;

    const savolBlocklari = document.querySelectorAll('.kiritilgan-javob');

    savolBlocklari.forEach(savolDiv => {
        const savolRaqami = savolDiv.getAttribute('data-question');
        const foydalanuvchiTanlovi = foydalanuvchiJavoblari[savolRaqami];
        const togriJavob = togriJavoblar[savolRaqami];

        // Hisoblash qismi
        if (!foydalanuvchiTanlovi) {
            belgilanmaganSoni++; // Agar umuman javob tanlamagan bo'lsa
        } else if (foydalanuvchiTanlovi === togriJavob) {
            togriSoni++; // To'g'ri topgan bo'lsa
        } else {
            xatoSoni++; // Xato tanlagan bo'lsa
        }

        // Ranglarni bo'yash qismi
        const tugmalar = savolDiv.querySelectorAll('.kalit');
        tugmalar.forEach(btn => {
            const btnJavob = btn.getAttribute('data-answer');

            if (btnJavob === togriJavob) {
                btn.classList.add('correct');
            }
            if (btnJavob === foydalanuvchiTanlovi && foydalanuvchiTanlovi !== togriJavob) {
                btn.classList.add('wrong');
            }
        });
    });

    // Natijani sahifaga chiqarish
    const natijaOynasi = document.getElementById('natija-oynasi');
    natijaOynasi.style.display = 'block';
    natijaOynasi.innerHTML = `
        <p style="color: #16a34a;">✅ To'g'ri javoblar: ${togriSoni} ta</p>
        <p style="color: #dc2626;">❌ Xato javoblar: ${xatoSoni} ta</p>
        <p style="color: #64748b;">⚪ Belgilanmagan: ${belgilanmaganSoni} ta</p>
    `;
});