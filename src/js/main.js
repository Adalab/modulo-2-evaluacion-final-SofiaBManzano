"use strict";

const input = document.querySelector(".js-inputSearch");
const btnSearch = document.querySelector(".js-btnSearch");
const btnReset = document.querySelector(".js-btnReset");
const divContainer = document.querySelector(".js-divContainer");
const linkBaseApi = `https://api.jikan.moe/v3/search/anime?q=`;

let dataApi = [];
let favs = [];
//recoger información de la api
function getApi(url) {
  fetch(url)
    .then((response) => response.json())
    .then((animeData) => {
      dataApi = animeData.results; //lista series
      console.log(dataApi);
      for (const serie of dataApi) {
        renderImageSerie(serie);
      }
      seriesListener();
    });
}

function renderImageSerie(serie) {
  if (
    serie.image_url ===
    "https://cdn.myanimelist.net/images/qm_50.gif?s=e1ff92a46db617cb83bfc1e205aff620"
  ) {
    serie.image_url =
      "https://via.placeholder.com/210x295/5d58d7/f696af/?text=TV";
  }
  divContainer.innerHTML += `<div class="divSerie" data-id="${serie.mal_id}"><p>${serie.title}</p><img src="${serie.image_url}" alt="${serie.title}"></img></div>`;
}

function handleSearchElement(ev) {
  ev.preventDefault();
  const urlApi = linkBaseApi + input.value;
  getApi(urlApi);
}

function handleReset(ev) {
  ev.preventDefault();
  console.log("limpio");
  divContainer.innerHTML = "";
}

function seriesListener() {
  const divSerie = document.querySelectorAll(".divSerie");
  for (const serieFav of divSerie) {
    serieFav.addEventListener("click", addFavorite);
    console.log(serieFav);
  }
}
// const addFavorite
function addFavorite(ev) {
  const id = ev.currentTarget.dataset.id;
  favs.push(dataApi.find((element) => element.mal_id === parseInt(id)));
  console.log(favs);
}
btnSearch.addEventListener("click", handleSearchElement);
btnReset.addEventListener("click", handleReset);
// divContainer.addEventListener("click", handleFav);
