const registerPayload = {
  phone: "901234567",
  password: "12345678",
  confirmPassword: "12345678",
};

const loginPayload = {
  phone: "+998901234567",
  password: "12345678",
};

async function main() {
  const registerResponse = await fetch("http://localhost:3000/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(registerPayload),
  });

  console.log("REGISTER_STATUS", registerResponse.status);
  console.log(await registerResponse.text());

  const loginResponse = await fetch("http://localhost:3000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(loginPayload),
  });

  console.log("LOGIN_STATUS", loginResponse.status);
  console.log(await loginResponse.text());

  const meResponse = await fetch("http://localhost:3000/api/me", {
    credentials: "include",
  });

  console.log("ME_STATUS", meResponse.status);
  console.log(await meResponse.text());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
