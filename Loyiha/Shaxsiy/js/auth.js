document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const logoutButton = document.getElementById("logout-button");

  if (loginForm) {
    const button = loginForm.querySelector('button[type="submit"]');
    const messageBox = document.getElementById("form-message");

    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const phoneInput = document.getElementById("phone");
      const passwordInput = document.getElementById("parol");

      const phone = normalizePhone(phoneInput.value);
      const password = passwordInput.value.trim();

      if (!phone) {
        showMessage(messageBox, "Telefon raqam noto'g'ri formatda.", true);
        return;
      }

      if (!password) {
        showMessage(messageBox, "Parolni kiriting.", true);
        return;
      }

      setSubmitState(button, true, "Kirish...");
      showMessage(messageBox, "", false);

      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "same-origin",
          body: JSON.stringify({ phone, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Telefon raqam yoki parol noto'g'ri");
        }

        showMessage(messageBox, "Kirish muvaffaqiyatli bajarildi.", false);
        window.location.href = "/Shaxsiy/Kirish/Kirish%20qismi.html";
      } catch (error) {
        showMessage(
          messageBox,
          error.message || "Telefon raqam yoki parol noto'g'ri",
          true,
        );
      } finally {
        setSubmitState(button, false, "Kirish");
      }
    });
  }

  if (registerForm) {
    const button = registerForm.querySelector('button[type="submit"]');
    const messageBox = document.getElementById("form-message");

    registerForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const phoneInput = document.getElementById("phone");
      const passwordInput = document.getElementById("parol");
      const confirmPasswordInput = document.getElementById("parol2");

      const phone = normalizePhone(phoneInput.value);
      const password = passwordInput.value.trim();
      const confirmPassword = confirmPasswordInput.value.trim();

      if (!phone) {
        showMessage(messageBox, "Telefon raqam noto'g'ri formatda.", true);
        return;
      }

      if (password.length < 8) {
        showMessage(
          messageBox,
          "Parol kamida 8 ta belgidan iborat bo'lishi kerak.",
          true,
        );
        return;
      }

      if (password !== confirmPassword) {
        showMessage(messageBox, "Parollar mos kelmadi.", true);
        return;
      }

      setSubmitState(button, true, "Ro'yxatdan o'tish...");
      showMessage(messageBox, "", false);

      try {
        const response = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "same-origin",
          body: JSON.stringify({
            phone,
            password,
            confirmPassword,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Ro'yxatdan o'tishda xatolik yuz berdi.",
          );
        }

        showMessage(
          messageBox,
          "Ro'yxatdan o'tish muvaffaqiyatli bajarildi. Kirish sahifasiga yo'naltirilmoqda...",
          false,
        );
        setTimeout(() => {
          window.location.href =
            "/Shaxsiy/Ro%27yxatdan%20o%27tish/Kirish%20qism.html";
        }, 700);
      } catch (error) {
        showMessage(
          messageBox,
          error.message || "Ro'yxatdan o'tishda xatolik yuz berdi.",
          true,
        );
      } finally {
        setSubmitState(button, false, "Ro'yxatdan o'tish");
      }
    });
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
      try {
        await fetch("/api/logout", {
          method: "POST",
          credentials: "same-origin",
        });
      } finally {
        window.location.href =
          "/Shaxsiy/Ro%27yxatdan%20o%27tish/Ro%27yxatdan%20o%27tish%20oynasi.html";
      }
    });
  }
});

function normalizePhone(phoneValue) {
  const digits = String(phoneValue || "").replace(/\D/g, "");

  if (!digits) {
    return null;
  }

  if (digits.startsWith("998")) {
    return digits.length === 12 ? `+${digits}` : null;
  }

  if (digits.length === 9) {
    return `+998${digits}`;
  }

  return null;
}

function showMessage(element, message, isError) {
  if (!element) {
    return;
  }

  if (!message) {
    element.textContent = "";
    element.style.display = "none";
    return;
  }

  element.textContent = message;
  element.classList.toggle("error", Boolean(isError));
  element.style.display = "block";
}

function setSubmitState(button, isLoading, label) {
  if (!button) {
    return;
  }

  button.disabled = isLoading;
  button.textContent = isLoading ? label : label;
}
