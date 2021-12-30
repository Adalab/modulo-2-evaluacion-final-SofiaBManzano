"use strict";

const input = document.querySelector(".js-inputSearch");
const btnSearch = document.querySelector(".js-btnSearch");
const btnReset = document.querySelector(".js-btnReset");
const divContainer = document.querySelector(".js-divContainer");
const containerFav = document.querySelector(".js-containerFavs");
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
  divContainer.innerHTML = "";
  const urlApi = linkBaseApi + input.value;
  getApi(urlApi);
}

function handleReset(ev) {
  ev.preventDefault();
  input.value = "";
  divContainer.innerHTML = "";
}

function seriesListener() {
  const divSerie = document.querySelectorAll(".divSerie");
  for (const serieFav of divSerie) {
    serieFav.addEventListener("click", addFavorite);
  }
}
function getHtmlFavoriteCode(element) {
  let htmlFavs = "";
  if (
    element.image_url ===
    "https://cdn.myanimelist.net/images/qm_50.gif?s=e1ff92a46db617cb83bfc1e205aff620"
  ) {
    element.image_url =
      "https://via.placeholder.com/210x295/5d58d7/f696af/?text=TV";
  }

  htmlFavs += `<ul class="ulFavs" data-id="${element.mal_id}">`;
  htmlFavs += `<li>${element.title}</li>`;
  htmlFavs += `<img src="${element.image_url}" alt="${element.title}"></img>`;
  htmlFavs += `</ul>`;
  return htmlFavs;
}
function paintFavorites(element) {
  containerFav.innerHTML = "";

  for (const element of favs) {
    containerFav.innerHTML += getHtmlFavoriteCode(element);
  }
}
// const addFavorite
function addFavorite(ev) {
  //favs.push(dataApi.find((element) => element.mal_id === parseInt(id)));

  //obtengo id del producto clickado
  const id = ev.currentTarget.dataset.id;
  //añado el producto
  if (!favs.find((element) => element.mal_id === parseInt(id))) {
    favs.push(dataApi.find((element) => element.mal_id === parseInt(id)));
    console.log(favs);
    paintFavorites();
    setInLocalStorage();
  }
}

function getFromLocalStorage() {
  const localStorageFavs = localStorage.getItem("favs");
  if (localStorageFavs !== null) {
    favs = JSON.parse(localStorageFavs);
    paintFavorites();
  }
}

//localStorage
function setInLocalStorage() {
  const stringifyFavs = JSON.stringify(favs);
  localStorage.setItem("favs", stringifyFavs);
}
getFromLocalStorage();
btnSearch.addEventListener("click", handleSearchElement);
btnReset.addEventListener("click", handleReset);
// divContainer.addEventListener("click", handleFav);
paintFavorites();
