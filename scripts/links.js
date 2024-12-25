// barra de navegacion
let homeButton = document.querySelector("#home__button");
let galeryButton = document.querySelector("#galery__button");
let cameraButton = document.querySelector("#camara__button");
let userButton = document.querySelector("#user__button");


const goCamera = () => {
    location.href = "camara.html";
}
const goHome = () => {
    location.href = "index.html";
}
const goGalery = () => {
    location.href = "galeria.html";
}
const goUser = () => {
    location.href ="perfil.html";
}

homeButton.addEventListener('click', goHome);
galeryButton.addEventListener('click', goGalery);
cameraButton.addEventListener('click', goCamera);
userButton.addEventListener('click', goUser);
