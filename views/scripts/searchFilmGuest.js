const APILINK =
  "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=7e98d25bedce84be8bd5c3c91ba346df&page=1";
const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI =
  "https://api.themoviedb.org/3/search/movie?language=ru-RU&api_key=7e98d25bedce84be8bd5c3c91ba346df&query=";

const main = document.getElementById("main-part");
const form = document.getElementById("form-search");
const search = document.getElementById("query");

async function returnMovies(url) {
  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.results.length === 0) {
      const noResultsMessage = document.createElement("div");
      noResultsMessage.classList.add("no-results-message");
      noResultsMessage.innerHTML = `Фильмы по запросу "${search.value.trim()}" не найдены.`;
      main.appendChild(noResultsMessage);
      return;
    }

    const divTitleSearch = document.createElement("div");
    divTitleSearch.classList.add("title-recommendations");
    divTitleSearch.innerHTML = `Поиск фильмов по запросу "${search.value.trim()}"`;
    main.appendChild(divTitleSearch);

    let filmCount = 0;
    let divRows = document.createElement("div");
    divRows.classList.add("rows");

    data.results.forEach((element) => {
      if (element.poster_path) {
        const buttonCards = document.createElement("button");
        buttonCards.classList.add("cards-guest");
        buttonCards.setAttribute("data-id", element.id);

        const divColumn = document.createElement("div");
        divColumn.classList.add("column");

        const image = document.createElement("img");
        image.classList.add("img-cards");
        image.setAttribute("alt", element.title);
        image.src = IMG_PATH + element.poster_path;

        const filmName = document.createElement("h3");
        filmName.setAttribute("id", "film-name");
        filmName.textContent = element.title;

        buttonCards.appendChild(image);
        buttonCards.appendChild(filmName);
        divColumn.appendChild(buttonCards);
        divRows.appendChild(divColumn);

        filmCount++;

        if (filmCount === 6) {
          main.appendChild(divRows);
          divRows = document.createElement("div");
          divRows.classList.add("rows");
          filmCount = 0;
        }

        buttonCards.addEventListener("click", function () {
          window.location.href = `/views/pages/not-authorized.html`;
        });
      }
    });

    if (filmCount > 0) {
      main.appendChild(divRows);
    }
  } catch (error) {
    console.error(`-!!!- Ошибка при получении фильмов ${error} -!!!-`);
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  main.innerHTML = "";

  const searchItem = search.value.trim();

  if (searchItem) {
    await returnMovies(SEARCHAPI + searchItem);
    search.value = "";
  }
});
