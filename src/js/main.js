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
  //Luego en la funcion handleSearchElement que se llama con un evento cuando el usuario da a buscar, llama a la api y le meto el resultado de la url x parametro
  fetch(url)
    .then((response) => response.json())
    .then((animeData) => {
      dataApi = animeData.results; //lista series
      console.log(dataApi);
      for (const serie of dataApi) {
        renderImageSerie(serie);
        //bucle para que me vaya pintando una por una la imagen y el titulo
      }
      //meto aquí el listener de cada serie para que tenga el listener una vez pintadas las series
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
  //aquí pinto la imagen. El data-id lo puse para localizar a cual daba a favoritos
  // divContainer.innerHTML += `<div class="divSerie" data-id="${}"><p>${serie.title}</p><img class= "image-search" src="${serie.image_url}" alt="${serie.title}"></img></div>`;
  
  //si en el array de favs encuentra un elemento con el mismo id que los de la busqueda, se añade una clase que le da el color de fondo de seleccionado
  if (favs.find((element) => element.mal_id === serie.mal_id)) {
    divContainer.innerHTML += `<div class="js-divSerieFavorite" data-id="${serie.mal_id}"><p>${serie.title}</p><img class= "image-search" src="${serie.image_url}" alt="${serie.title}"></img></div>`;
  } else {
    divContainer.innerHTML += `<div class="divSerie" data-id="${serie.mal_id}"><p>${serie.title}</p><img class= "image-search" src="${serie.image_url}" alt="${serie.title}"></img></div>`;
  }
}

//función fandle de cuando se da a "buscar"
function handleSearchElement(ev) {
  //cuando el usuario da a "buscar", se limpia con el innerHTML los resultados de la busqueda anterior
  ev.preventDefault();
  divContainer.innerHTML = "";
  //es aqui cuando modifico el "linkBaseApi" para meterle el value del input
  const urlApi = linkBaseApi + input.value;
  //y aqui es donde ya se llama al fetch para que me busque lo que yo quiero
  getApi(urlApi);
}

//funcion de hacer reset en la búsqueda
function handleReset(ev) {
  ev.preventDefault();
  input.value = "";
  divContainer.innerHTML = "";
}

//listener que escucha cada div contenedor de cada serie para más tarde añadirlo a favorito
function seriesListener() {
  const divSerie = document.querySelectorAll(".divSerie");
  //hago bucle para que todas esas series tengan un listener
  for (const serieFav of divSerie) {
    serieFav.addEventListener("click", addFavorite);
  }
}

//funcion de codigo de los favoritos que necesitarán el id también para luego comparar
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
  htmlFavs += `<img class="image-favs" src="${element.image_url}" alt="${element.title}"></img>`;
  htmlFavs += `<li class= "titleFavs"> ${element.title} </li>`;
  htmlFavs += `<span class="removeFavs">X</span>`;
  htmlFavs += `</ul>`;
  return htmlFavs;
}

function paintFavorites(element) {

  containerFav.innerHTML = "";
//blucle por el nuevo array de favs
  for (const element of favs) {
    //por cada element de favs me creo el codigo de la funcion getHtmlFavoriteCode
    containerFav.innerHTML += getHtmlFavoriteCode(element);
  }
  //me saco todas las X del html que es lo que borrará favs
  const removeFavs = document.querySelectorAll(".removeFavs");
  for (const removeFav of removeFavs) {
    ///necesito un listener para cada cruz
    removeFav.addEventListener("click", handleRemoveFav);
  }
}

//funcion que hará que se borren los favs dando a la X
function handleRemoveFav(ev) {
  //me creo un nuevo array porque cada vez que borre un favorito se creará una nueva lista sin el que borré
  let newFavs = [];
  // parentNode para llegar al id desde la X (es un span y el id esta en el padre);
  const id = ev.currentTarget.parentNode.dataset.id;
  for (const animeFav of favs) {
    //si el id de la X es diferente al id de favs, pushea en el array de newFavs el id del favs
    if (parseInt(id) !== parseInt(animeFav.mal_id)) {
      //si el id es diferente.. 
      newFavs.push(animeFav);
    }
  }
//le digo que favs es lo mismo que newFavs para que se me pinte de nuevo el array ya sin esa serie que borré
  favs = newFavs;
//me pinta los favoritos de nuevo sin el que he eliminado
  paintFavorites();
  //donde salen las series, borro todo
  divContainer.innerHTML = "";
//vuelvo a pintar todas las serie y cuando las vuelvo a pintar, como he quitado una de favoritos, esta nueva pintada me sale sin background
  for (const serie of dataApi) {
    renderImageSerie(serie);
  }
  //una vez pintadas le vuelvo a meter el listener a cada serie y le vuelvo a meter el localStorage
  seriesListener();
  setInLocalStorage();
}


//funcion de añadir a favorito
function addFavorite(ev) {
  //obtengo id del producto clickado
  const id = ev.currentTarget.dataset.id;

  //si no encuentras el elemento en favs con ese id, lo pusheas en el array de favs
  if (!favs.find((element) => element.mal_id === parseInt(id))) {
    //cambio el fondo del elemento clickado
    ev.currentTarget.classList.remove("divSerie");
    ev.currentTarget.classList.add("js-divSerieFavorite");
    //pusheo
    favs.push(dataApi.find((element) => element.mal_id === parseInt(id)));
    console.log(favs);
    //pinto favoritos y meto en el localStorage
    paintFavorites();
    setInLocalStorage();
  }
}

//LocalStorage
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
paintFavorites();
