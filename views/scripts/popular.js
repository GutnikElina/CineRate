const Url =
  "https://api.themoviedb.org/3/movie/popular?language=ru-RU&api_key=7e98d25bedce84be8bd5c3c91ba346df&page=3";
const IMG_PATH_ = "https://image.tmdb.org/t/p/w1280";

const popular = document.getElementById("popular");

returnPopularMovies(Url);

function returnPopularMovies(Url) {
  fetch(Url)
    .then((res) => res.json())
    .then(function (data) {
      const div_title = document.createElement("div");
      div_title.setAttribute("class", "title-recommendations");
      div_title.innerHTML = "ПОПУЛЯРНОЕ";
      popular.appendChild(div_title);

      let filmCount = 0;
      let div_rows = document.createElement("div");
      div_rows.setAttribute("class", "rows");

      data.results.forEach((element) => {
        if (element.poster_path) {
          const button_cards = document.createElement("button");
          button_cards.setAttribute("class", "cards-guest");
          button_cards.setAttribute("type", "submit");
          button_cards.setAttribute("data-id", element.id);

          const div_column = document.createElement("div");
          div_column.setAttribute("class", "column");

          const image = document.createElement("img");
          image.setAttribute("class", "img-cards");
          image.setAttribute("id", "image-film");
          image.setAttribute("alt", element.title);

          const film_name = document.createElement("h3");
          film_name.setAttribute("id", "film-name");

          film_name.innerHTML = `${element.title}`;
          image.src = IMG_PATH_ + element.poster_path;

          button_cards.appendChild(image);
          button_cards.appendChild(film_name);

          div_column.appendChild(button_cards);

          div_rows.appendChild(div_column);

          filmCount++;

          if (filmCount === 6) {
            popular.appendChild(div_rows);
            div_rows = document.createElement("div");
            div_rows.setAttribute("class", "rows");
            filmCount = 0;
          }

          button_cards.addEventListener("click", function () {
            const movieId = element.id;
            const movieTitle = element.title;
            window.location.href = `/views/pages/descritpion-film.html?id=${movieId}&title=${movieTitle}`;
          });
        }
      });
      if (filmCount > 0) {
        popular.appendChild(div_rows);
      }
    });
}
