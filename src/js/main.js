"use strict";

const input = document.querySelector(".js-inputSearch");
const btnSearch = document.querySelector(".js-btnSearch");
const btnReset = document.querySelector(".js-btnReset");
const divContainer = document.querySelector(".js-divContainer");
const containerFav = document.querySelector(".js-containerFavs");
//Al link de la api le quité lo de naruto
const linkBaseApi = `https://api.jikan.moe/v3/search/anime?q=`;

//me creé un array vacío para meter la información de la api
let dataApi = [];

//en el array de favs se meterán las series que le de a fav
let favs = [];

//recojo información de la api dentro de una función
function getApi(url) {
  //este "url" es un parametro.
  //Luego en la funcion handleSearchElement que se llama con un evento cuando el usuario da a buscar, llama a la api y le meto
  //el resultado de la url x parametro
  fetch(url)
    .then((response) => response.json())
    .then((animeData) => {
      dataApi = animeData.results; //lista series
      console.log(dataApi);
      for (const serie of dataApi) {
        renderImageSerie(serie);
        //bucle para que me vaya pintando una por una la imagen y el titulo
      }
      seriesListener();
    });
}

//función de pintar la imagen
function renderImageSerie(serie) {
  //este condicional es para sustituir si hubiera alguna serie sin imagen
  if (
    serie.image_url ===
    "https://cdn.myanimelist.net/images/qm_50.gif?s=e1ff92a46db617cb83bfc1e205aff620"
  ) {
    serie.image_url =
      "https://via.placeholder.com/210x295/5d58d7/f696af/?text=TV";
  }
  //aquí pinto la imagen. El data-id lo puse mas tarde para localizar a cual daba a favoritos
  divContainer.innerHTML += `<div class="divSerie" data-id="${serie.mal_id}"><p>${serie.title}</p><img src="${serie.image_url}" alt="${serie.title}"></img></div>`;
}

function handleSearchElement(ev) {
  //cuando el usuario da a "buscar", se limpia con el innerHTML los resultados de la busqueda anterior
  ev.preventDefault();
  divContainer.innerHTML = "";
  //es aqui cuando modifico el "linkBaseApi" para meterle el value del input
  const urlApi = linkBaseApi + input.value;
  //y aqui es donde ya se llama al fetch para que me busque lo que yo quiero
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
  htmlFavs += `<li class= "titleFavs">♡ ${element.title} ♡</li>`;
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
  if (localStorageFavs) {
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
