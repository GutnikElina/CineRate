const IMG_PATH = "https://image.tmdb.org/t/p/w1280";

const token =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ZTk4ZDI1YmVkY2U4NGJlOGJkNWMzYzkxYmEzNDZkZiIsInN1YiI6IjY2MTgzYWNmZTlkYTY5MDE0ODgxYjYzMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hgnRjFJQ43antT8H3qBGdOIyRUeMqvDgD8r8ZJUR_z0";

let filmCount = 0;

const main = document.getElementById("section-list");

async function getAllMoviesFromList() {
  try {
    const userToken = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    const response = await fetch("http://localhost:4444/api/list", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });

    if (!response.ok) {
      throw new Error(
        "Не удалось получить информацию о списке. Пожалуйста, проверьте ваш API ключ и попробуйте снова."
      );
    }
    const data = await response.json();

    const divTitleList = document.createElement("div");
    divTitleList.className = "title-recommendations";
    divTitleList.textContent = "ИЗБРАННОЕ";
    main.appendChild(divTitleList);

    if (data.length === 0) {
      const noMoviesMessage = document.createElement("div");
      noMoviesMessage.className = "no-results-message";
      noMoviesMessage.textContent = "В вашем списке нет фильмов.";
      main.appendChild(noMoviesMessage);
      return;
    }

    let divRows = document.createElement("div");
    divRows.className = "rows";

    data.forEach((element) => {
      filmCount = 0;
      if (element.movieInfo.poster_path) {
        const buttonCards = document.createElement("button");
        buttonCards.className = "cards";
        buttonCards.type = "submit";
        buttonCards.dataset.id = element._id;

        const divColumn = document.createElement("div");
        divColumn.className = "column";

        const image = document.createElement("img");
        image.className = "img-cards";
        image.id = "image-film";
        image.alt = element.movieInfo.title;
        image.src = IMG_PATH + element.movieInfo.poster_path;

        const filmName = document.createElement("h3");
        filmName.id = "film-name";
        filmName.textContent = element.movieInfo.title;

        buttonCards.appendChild(image);
        buttonCards.appendChild(filmName);

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Удалить";
        deleteButton.dataset.id = element._id;

        deleteButton.addEventListener("click", async function (event) {
          event.stopPropagation();
          const movieId = element._id;
          try {
            await removeItemFromList(movieId);
            main.innerHTML = "";
            await getAllMoviesFromList();
          } catch (error) {
            console.error(
              "Произошла ошибка при удалении фильма:",
              error.message
            );
          }
        });

        buttonCards.appendChild(deleteButton);

        divColumn.appendChild(buttonCards);

        divRows.appendChild(divColumn);
        filmCount++;

        if (filmCount === 6) {
          main.appendChild(divRows);
          divRows = document.createElement("div");
          divRows.className = "rows";
          filmCount = 0;
        }

        buttonCards.addEventListener("click", function () {
          const movieId = element.movieInfo.id;
          const movieTitle = element.movieInfo.title;
          console.log(movieId, movieTitle);
          window.location.href = `/views/pages/descritpion-film.html?id=${movieId}&title=${movieTitle}`;
        });
      }
    });

    if (filmCount > 0) {
      main.appendChild(divRows);
    }
  } catch (error) {
    console.error("-!!!- Произошла ошибка:", error.message);
  }
}

async function addItemToList(movieId) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json;charset=utf-8",
        },
      }
    );
    const movieInfo = await response.json();
    const username = localStorage.getItem("username");

    await saveMovieToMongoDB(username, movieInfo);
  } catch (error) {
    console.error("-!!! Произошла ошибка:", error.message);
  }
}

async function saveMovieToMongoDB(username, movieInfo) {
  try {
    const userToken = localStorage.getItem("token");
    const response = await fetch("http://localhost:4444/api/list/add_item", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
      body: JSON.stringify({ username: username, movieInfo: movieInfo }),
    });

    if (response.ok) {
      console.log("Фильм успешно добавлен в список!");
    } else {
      throw new Error("-!!! Не удалось добавить фильм в список избранных -!!!");
    }
  } catch (error) {
    console.error(
      "-!!! Произошла ошибка при сохранении фильма в базу данных:",
      error.message
    );
  }
}

async function removeItemFromList(movieId) {
  try {
    const userToken = localStorage.getItem("token");
    const response = await fetch("http://localhost:4444/api/list/remove_item", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
      body: JSON.stringify({ movieId }),
    });

    if (response.ok) {
      console.log("Фильм успешно удален из списка!");
    } else {
      throw new Error("-!!!- Не удалось удалить фильм из списка -!!!");
    }
  } catch (error) {
    console.error("-!!! Произошла ошибка при удалении фильма:", error.message);
  }
}
