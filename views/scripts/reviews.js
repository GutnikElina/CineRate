const token = localStorage.getItem("token");
const currentUsername = localStorage.getItem("username");

const url = new URL(location.href);
const movieId = url.searchParams.get("id");
const movieTitle = url.searchParams.get("title");

const APILINK = "http://localhost:4444/api/";

const main = document.getElementById("section-recommendations");
const title = document.getElementById("title");

title.innerText = movieTitle;

returnReviewsForAdmin(APILINK);

function returnReviewsForAdmin(url) {
  fetch(url + "/reviews/movie/" + movieId)
    .then((res) => res.json())
    .then(function (data) {
      if (data.length === 0) {
        const noReviewsMessage = document.createElement("p");
        noReviewsMessage.innerText = "Нет отзывов";
        noReviewsMessage.setAttribute("class", "no-reviews-message");
        main.appendChild(noReviewsMessage);
      } else {
        const table = document.createElement("table");
        table.setAttribute(
          "class",
          "table table-dark table-striped table-hover table-bordered border-secondary "
        );
        table.setAttribute("id", "table-review");

        const row = table.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);

        cell1.innerHTML = "ПОЛЬЗОВАТЕЛЬ:";
        cell2.innerHTML = "ОТЗЫВ:";
        cell3.innerHTML = "ДЕЙСТВИЯ:";

        data.forEach((review) => {
          const row = table.insertRow();
          const cell1 = row.insertCell(0);
          const cell2 = row.insertCell(1);
          const cell3 = row.insertCell(2);

          cell1.innerHTML = review.username;
          cell2.innerHTML = review.text;
          if (review.username === currentUsername) {
            cell3.innerHTML = `<button class="edit-button" onclick="editReview('${review._id}', '${review.text}')">✏️Редактировать</button> 
            <button class="delete-review-button" onclick="deleteReview('${review._id}')">🗑️Удалить</button>`;
          } else {
            cell3.innerHTML = "";
          }
        });

        main.appendChild(table);
      }
    });
}

function editReview(reviewId, reviewText) {
  const reviewRow = document.querySelector(`button[onclick*="${reviewId}"]`)
    .parentElement.parentElement;
  const reviewCell = reviewRow.cells[1];
  reviewCell.innerHTML = `
    <textarea id="edit-review-text" rows="3">${reviewText}</textarea>
    <button class="save-button" onclick="saveReview('${reviewId}')">💾Сохранить</button>
    <button class="cancel-button" onclick="cancelEditReview('${reviewId}', '${reviewText}')">❌Отмена</button>
  `;
}

function saveReview(reviewId) {
  const newText = document.getElementById("edit-review-text").value;

  fetch(APILINK + "reviews/" + reviewId, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ text: newText }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "Успешное редактирование отзыва") {
        location.reload();
      } else {
        alert(data.message);
      }
    })
    .catch((error) => {
      console.error("Ошибка:", error);
      alert(
        "Произошла ошибка при сохранении отзыва. Пожалуйста, попробуйте еще раз."
      );
    });
}

function cancelEditReview(reviewId, reviewText) {
  const reviewRow = document.querySelector(`button[onclick*="${reviewId}"]`)
    .parentElement.parentElement;
  reviewRow.cells[1].innerHTML = reviewText;
}

function deleteReview(reviewId) {
  if (confirm("Вы уверены, что хотите удалить этот отзыв?")) {
    try {
      fetch(`http://localhost:4444/api/review/${reviewId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      location.reload();
    } catch (error) {
      console.error("-!!!- Ошибка при удалении отзыва -!!!-");
      alert(
        "-!!!- Ошибка при удалении пользователя. Пожалуйста, попробуйте еще раз. -!!!-"
      );
    }
  }
}

document
  .getElementById("write-button")
  .addEventListener("click", async (event) => {
    event.preventDefault();

    const text = document.getElementById("write-review").value;
    const filmName = movieTitle;

    try {
      const response = await fetch(APILINK + "/review/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ movieId, text, filmName }),
      });

      const data = await response.json();

      if (response.ok) {
        location.reload();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Ошибка:", error);
      alert(
        "-!!!- Произошла ошибка при отправлении отзыва. Пожалуйста, попробуйте еще раз. -!!!-"
      );
    }
  });
