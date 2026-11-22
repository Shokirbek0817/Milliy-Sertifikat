
  function asosiyXabar(event) {
    event.preventDefault();
    alert("Siz allaqachon asosiydasiz!");
  }

  const menyuTugma = document.getElementById("menyu");
  const menyuRoyxat = document.querySelector(".qidiruv-elementlari");
  const tugmaMatn = menyuTugma.querySelector("button");

  menyuTugma.addEventListener("click", function () {
    menyuRoyxat.classList.toggle("korinsin");

    if (menyuRoyxat.classList.contains("korinsin")) {
      tugmaMatn.textContent = "Menyuni yopish";
    } else {
      tugmaMatn.textContent = "Menyuni ochish";
    }
  });