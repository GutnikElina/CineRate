const token = localStorage.getItem("token");

function goBack() {
  window.location.href = "/views/pages/admin.html";
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/views/pages/index.html";
}

async function showUsers() {
  try {
    const contentDiv = document.getElementById("Body");
    contentDiv.innerHTML = "";

    const response = await fetch("http://localhost:4444/api/admin/users");
    const users = await response.json();

    const div_main = document.createElement("div");
    div_main.setAttribute("class", "main-part");

    if (users.length === 0) {
      const message = document.createElement("p");
      message.textContent = "Нет пользователей.";
      message.classList.add("no-message");
      div_main.appendChild(message);
    } else {
      const table = document.createElement("table");
      table.setAttribute("id", "users-table");
      table.classList.add("table", "table-hover");

      const thead = document.createElement("thead");
      thead.innerHTML = `
      <tr>
        <th>ID</th>
        <th>Логин</th>
        <th>ФИО пользователя</th>
        <th>Email</th>
        <th>Действия</th>
      </tr>
    `;
      table.appendChild(thead);

      const tbody = document.createElement("tbody");

      users.forEach((user) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
        <td>${user._id}</td>
        <td>${user.username}</td>
        <td>${user.fullName}</td>
        <td>${user.email}</td>
        <td>
          <button onclick="editUser('${user._id}')" class="btn btn-primary">Редактировать</button>
          <button onclick="deleteUser('${user._id}')" class="btn btn-danger">Удалить</button>
        </td>
      `;
        tbody.appendChild(tr);
      });

      table.appendChild(tbody);
      div_main.appendChild(table);
    }

    const div_button = document.createElement("div");
    div_button.innerHTML =
      "<button onclick='goBack()' id='back-button' class='btn btn-secondary'>Назад</button>";

    div_main.appendChild(div_button);
    contentDiv.appendChild(div_main);
  } catch (error) {
    console.error("-!!!- Ошибка при загрузке пользователей:", error);
    alert(
      "-!!!- Ошибка при загрузке пользователей. Пожалуйста, попробуйте еще раз. -!!!-"
    );
  }
}

async function editUser(userId) {
  const userData = {
    username: prompt("Введите новый логин пользователя:"),
    fullName: prompt("Введите новое ФИО пользователя:"),
    email: prompt("Введите новый email пользователя:"),
  };

  try {
    await fetch(`http://localhost:4444/api/admin/user/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(userData),
    });
    showUsers();
  } catch (error) {
    console.error("-!!!- Ошибка при редактировании пользователя:", error);
    alert(
      "-!!!- Ошибка при редактировании пользователя. Пожалуйста, попробуйте еще раз. -!!!-"
    );
  }
}

async function deleteUser(userId) {
  if (confirm("Вы уверены, что хотите удалить этого пользователя?")) {
    try {
      await fetch(`http://localhost:4444/api/admin/users/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      showUsers();
    } catch (error) {
      console.error("-!!!- Ошибка при удалении пользователя:", error);
      alert(
        "-!!!- Ошибка при удалении пользователя. Пожалуйста, попробуйте еще раз. -!!!-"
      );
    }
  }
}

async function showReviews() {
  const contentDiv = document.getElementById("Body");
  contentDiv.innerHTML = "";

  try {
    const response = await fetch("http://localhost:4444/api/reviews");
    const reviews = await response.json();

    const div_main = document.createElement("div");
    div_main.setAttribute("class", "main-part");

    if (reviews.length === 0) {
      const message = document.createElement("p");
      message.textContent = "Нет отзывов.";
      message.classList.add("no-message");
      div_main.appendChild(message);
    } else {
      const table = document.createElement("table");
      table.setAttribute("id", "users-table");
      table.classList.add("table", "table-hover");

      const thead = document.createElement("thead");
      thead.innerHTML = `
      <tr>
        <th>Логин</th>
        <th>Название фильма</th>
        <th>Отзыв</th>
        <th>Действия</th>
      </tr>
    `;
      table.appendChild(thead);

      const tbody = document.createElement("tbody");

      reviews.forEach((review) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
        <td>${review.username}</td>
        <td>${review.filmName}</td>
        <td>${review.text}</td>
        <td>
          <button onclick="editReviews('${review._id}')" class="btn btn-primary">Редактировать</button>
          <button onclick="deleteReviews('${review._id}')" class="btn btn-danger">Удалить</button>
        </td>
      `;
        tbody.appendChild(tr);
      });

      table.appendChild(tbody);
      div_main.appendChild(table);
    }

    const div_button = document.createElement("div");
    div_button.innerHTML =
      "<button onclick='goBack()' id='back-button' class='btn btn-secondary'>Назад</button>";

    div_main.appendChild(div_button);
    contentDiv.appendChild(div_main);
  } catch (error) {
    console.error("-!!!- Ошибка при загрузке отзывов -!!!-");
    alert(
      "-!!!-Ошибка при загрузке отзывов. Пожалуйста, попробуйте еще раз -!!!-"
    );
  }
}

async function deleteReviews(reviewId) {
  if (confirm("Вы уверены, что хотите удалить этот отзыв?")) {
    try {
      await fetch(`http://localhost:4444/api/review/${reviewId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      showReviews();
    } catch (error) {
      console.error("-!!!- Ошибка при удалении отзыва -!!!-");
      alert(
        "-!!!- Ошибка при удалении пользователя. Пожалуйста, попробуйте еще раз. -!!!-"
      );
    }
  }
}

async function editReviews(reviewId) {
  const reviewData = {
    text: prompt("Введите новый текст отзыва:"),
  };

  try {
    await fetch(`http://localhost:4444/api/reviews/${reviewId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(reviewData),
    });
    showReviews();
  } catch (error) {
    console.error("-!!!- Ошибка при редактировании отзыва -!!!-");
    alert(
      "-!!!- Ошибка при редактировании отзыва. Пожалуйста, попробуйте еще раз. -!!!-"
    );
  }
}
