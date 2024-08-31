const ur = new URL(location.href);
const movieId = ur.searchParams.get("id");
const movieTitle = ur.searchParams.get("title");

const IMG_PATH_ = "https://image.tmdb.org/t/p/w1280";
const Url = `https://api.themoviedb.org/3/movie/${movieId}?language=ru-RU&api_key=7e98d25bedce84be8bd5c3c91ba346df`;

const section_description = document.getElementById("section-description");
const description = document.getElementById("description");

let reviewButton = document.querySelector(".registration");
reviewButton.addEventListener("click", function () {
  if (movieId && movieTitle) {
    window.location.href = `/views/pages/reviews.html?id=${movieId}&title=${movieTitle}`;
  }
});

if (movieId) {
  returnDescription(Url);
} else {
  section_description.innerHTML = "";
}

function returnDescription(url) {
  fetch(url)
    .then((res) => res.json())
    .then(function (data) {
      const {
        backdrop_path: backdropPath,
        title,
        overview,
        release_date: releaseDate,
        budget,
        runtime,
        vote_count: voteCount,
        vote_average: voteAverage,
        genres,
      } = data;

      const genresList = genres.map((genre) => genre.name).join(", ");

      const html = `
        <div class="film-poster">
          <img src="${IMG_PATH_}${backdropPath}" alt="${title}" class="back-poster">
        </div>
        <div class="text-content">
          <p class="rating" style="font-size: 2em; color: gold; margin: 10px 0;">★ ${voteAverage}</p>
          <h2>${title}</h2>
          <p><strong>Release Date:</strong> ${releaseDate}</p>
          <p><strong>Overview:</strong> ${overview}</p>
        </div>
      `;

      section_description.innerHTML = html;

      const html_2 = `
        <div class="overview">
          <p><strong>Рейтинг:</strong>  ${voteAverage}.</p>
          <p><strong>Genres:</strong> ${genresList}</p>
          <p><strong>Продолжительность:</strong>  ${runtime} мин.</p>
          <p><strong>Бюджет:</strong>  ${budget}$.</p>
          <p><strong>Количество оценок:</strong>  ${voteCount}.</p>
        </div>
      `;

      description.innerHTML = html_2;
    })
    .catch(function (error) {
      console.error("Ошибка при загрузке данных:", error);
      section_description.innerHTML = `${error}`;
    });
}
