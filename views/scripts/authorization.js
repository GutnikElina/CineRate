const APILINK = "http://localhost:4444/api/";

document
  .getElementById("enter-button")
  .addEventListener("click", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch(APILINK + "/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
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
        const token = data.token;
        const username = data.username;
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        if (data.userRole == "ADMIN") {
          window.location.href = "/views/pages/admin.html";
        } else {
          window.location.href = "/views/pages/user.html";
        }
      }
    } catch (error) {
      console.error("Ошибка:", error);
      alert(
        "-!!!- Произошла ошибка при входе. Пожалуйста, попробуйте еще раз. -!!!-"
      );
    }
  });
