const APILINK = "http://localhost:4444/api/";

document
  .getElementById("register-button")
  .addEventListener("click", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const fullName = document.getElementById("fio").value;
    const username = document.getElementById("username").value;

    try {
      const response = await fetch(APILINK + "/auth/registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, fullName, username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const errors = data.errors.map((error) => error.msg).join("\n");
          alert(errors);
        } else {
          alert(data.message);
        }
      } else {
        window.location.href = "/views/pages/authorization.html";
      }
    } catch (error) {
      console.error("Ошибка:", error);
      alert(
        "-!!!- Произошла ошибка при регистрации. Пожалуйста, попробуйте еще раз. -!!!-"
      );
    }
  });
