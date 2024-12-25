const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const resultado = document.getElementById('resultado');
const infoAve = document.getElementById("info-ave");
const btnDetectar = document.getElementById('btn-detectar');
const blurred = document.getElementById('blurred');
const instruccion = document.getElementById('instruccion');

const listaAves = [
    { "id": 0, "nombre": "Aguilucho" },
    { "id": 1, "nombre": "Chincol" },
    { "id": 2, "nombre": "Cometocino" },
    { "id": 3, "nombre": "Cóndor" },
    { "id": 4, "nombre": "Espátula" },
    { "id": 5, "nombre": "Fiu" },
    { "id": 6, "nombre": "Garza Cuca" },
    { "id": 7, "nombre": "Gaviota Argéntea" },
    { "id": 8, "nombre": "Huairavillo" },
    { "id": 9, "nombre": "Jilguero Chileno" },
    { "id": 10, "nombre": "Lechuza" },
    { "id": 11, "nombre": "Loica" },
    { "id": 12, "nombre": "Martin Pescador" },
    { "id": 13, "nombre": "Ñandú" },
    { "id": 14, "nombre": "Pájaro Huala" },
    { "id": 15, "nombre": "Parina Grande" },
    { "id": 16, "nombre": "Pato Real" },
    { "id": 17, "nombre": "Pelicano" },
    { "id": 18, "nombre": "Perdiz Chilena" },
    { "id": 19, "nombre": "Peuco" },
    { "id": 20, "nombre": "Picaflor" },
    { "id": 21, "nombre": "Tiuque" },
    { "id": 22, "nombre": "Tordo" },
    { "id": 23, "nombre": "Tórtola" },
    { "id": 24, "nombre": "Zarapito" }
]

let modelo = null;
let lastPrediction = null;

var sound = new Audio();
sound.src = "public/snap.mp3";

async function cargarModelo() {
    console.log("Cargando modelo...");
    modelo = await tf.loadGraphModel("model.json");
    //modelo = await tf.loadLayersModel("model.json");
    console.log("Modelo cargado...");
}

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const imageURL = URL.createObjectURL(file);
        preview.src = imageURL;
        preview.style.display = 'block';
        preview.style.border= "2px solid #F83758";
        preview.alt = "Vista previa de la imagen seleccionada";
        blurred.style.display = 'none';
        instruccion.style.display = 'none';
    }
});

preview.addEventListener('load', async () => {
    if (modelo) {
        const inputTensor = tf.tidy(() => {
            const image = tf.browser.fromPixels(preview);
            const processedImage = tf.image.resizeBilinear(image, [224, 224]);
            const input = tf.expandDims(processedImage.toFloat().div(255), 0);
            return input;
        })
        const prediction = await modelo.predict(inputTensor).data();
        //**//
        console.log("\n valors:", prediction);
        const valorPrediction = Math.max(...prediction);
        console.log("valorPrediction - valor maximo:", valorPrediction)
        const maxPredictionIndex = prediction.indexOf(Math.max(...prediction));
        console.log("maxPredictionIndex:", maxPredictionIndex);
        const prediccionActual = listaAves.find(listaAves => listaAves.id === maxPredictionIndex)?.nombre;
        if (valorPrediction < 0.68) {
            resultado.textContent = `No se detectó ninguna ave, intenta una vez mas.`;
        } else if (valorPrediction < 0.85) {
            resultado.textContent = `Posible deteccion: ${prediccionActual}. \n Intenta Enfocar mejor la imagen.`;
            lastPrediction = prediccionActual;
            tf.dispose(inputTensor);
        } else {
            resultado.textContent = `Predicción: ${prediccionActual}`;
            console.log("Predicción: ", prediccionActual);
            lastPrediction = prediccionActual;
            console.log("lastPrediction: ", lastPrediction);
            tf.dispose(inputTensor);
        }
        if (prediccionActual === lastPrediction) {
            btnDetectar.classList.add("activo");
            btnDetectar.style.display = "block";
        } else {
            btnDetectar.classList.remove("activo");
            btnDetectar.style.display = 'none';
        }
    }
})
async function cargarDatosAve(ave) {
    const response = await fetch("aves-datos.txt");
    const data = await response.text();
    const avesInfo = JSON.parse(data);
    if (avesInfo[ave]) {
        const datos = avesInfo[ave];
        console.log("datos:", datos);
        infoAve.innerHTML = `
            <h3>${ave}</h3>
            <p><strong>Nombre Científico:</strong> ${datos.name}</p>
            <p><strong>Origen:</strong> ${datos.origen}</p>
            <p><strong>Datos:</strong> ${datos.datos}</p>
        `;
    }
}
btnDetectar.addEventListener("click", () => {
    if (lastPrediction) {
        cargarDatosAve(lastPrediction);
    }
})

// barra de navegacion

/*

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
*/


/*camera*/

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
function mostrarCamara() {
    const opciones = {
        audio: false,
        video: {
            facingMode: "environment",
            width: 400,
            height: 400,
        },
    };

    navigator.mediaDevices.getUserMedia(opciones)
        .then((stream) => {
            video.srcObject = stream;
            procesarCamara();
        })
        .catch((err) => {
            console.error("No se pudo acceder a la cámara:", err);
        });
}

// Procesar la cámara en el canvas
function procesarCamara() {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    setTimeout(procesarCamara, 20);
}
mostrarCamara();
cargarModelo();