const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const listaAves = [
    { "id": 0, "nombre": "Aguilucho" },
    { "id": 1, "nombre": "Chincol" },
    { "id": 2, "nombre": "Cometocino" },
    { "id": 3, "nombre": "Cóndor" },
    { "id": 4, "nombre": "Espatula" },
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

//Cons Resultados
const prediccion = document.getElementById("prediccion");
const resultado = document.getElementById("resultado");
const btnDetectar = document.getElementById("btn-detectar");
const infoAve = document.getElementById("info-ave");

//Const para capturar foto
const captureButton = document.getElementById("captureButton");
const capturedImage = document.getElementById("capturedImage");

//Const para reiniciar la camara
const retomarButton = document.getElementById('retomarButton');

let modelo = null;
let lastPrediction = null;
let stablePredictionTime = 0;
const predictionThreshold = 3000; // 3 segundos

// Cargar el modelo
async function cargarModelo() {
    console.log("Cargando modelo...");
    modelo = await tf.loadGraphModel("model.json");
    //modelo = await tf.loadLayersModel("model.json");
    console.log("Modelo cargado...");
}

// Mostrar la cámara
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
            predecir();
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

// Hacer predicciones
async function predecir() {
    if (modelo) {
        const inputTensor = tf.tidy(() => {
            const img = tf.browser.fromPixels(capturedImage); //a que imagen se le hace la prediccion
            const resized = tf.image.resizeBilinear(img, [224, 224]);
            const normalized = resized.toFloat().div(255);
            return normalized.expandDims(0);
        });

        const prediction = await modelo.predict(inputTensor).data();
        console.log("\n valors:", prediction);
        const valorPrediction = Math.max(...prediction);
        console.log("valorPrediction - valor maximo:", valorPrediction)
        const maxPredictionIndex = prediction.indexOf(Math.max(...prediction));
        console.log("maxPredictionIndex:", maxPredictionIndex);
        const prediccionActual = listaAves.find(listaAves => listaAves.id === maxPredictionIndex)?.nombre;
        if (valorPrediction < 0.60) {
            resultado.textContent = `No se detectó ninguna ave, intenta una vez mas.`;
            lastPrediction = null
        } else if (valorPrediction < 0.80) {
            resultado.textContent = `Posible deteccion: ${prediccionActual}. \n Intenta Enfocar mejor la imagen.`;
            lastPrediction = prediccionActual;
            tf.dispose(inputTensor);
        } else {
            resultado.textContent = `Predicción: ${prediccionActual}`;
            lastPrediction = prediccionActual;
            tf.dispose(inputTensor);
        }
        if (prediccionActual === lastPrediction) {
            saveButton.style.display = 'block'
            saveButton.addEventListener('click', () => {
                    const imageData = capturedImage.src;
                    let savedImages = JSON.parse(localStorage.getItem('savedImages')) || [];
                    savedImages.push(imageData);
                    localStorage.setItem('savedImages', JSON.stringify(savedImages));
            });
            btnDetectar.classList.add("activo");
            btnDetectar.style.display = "block";
        } else {
            btnDetectar.classList.remove("activo");
            btnDetectar.style.display = 'none';
        }
    }
}

// Cargar información del ave desde el archivo
async function cargarDatosAve(ave) {
    const response = await fetch("aves-datos.txt");
    const data = await response.text();
    const avesInfo = JSON.parse(data);
    if (avesInfo[ave]) {
        const datos = avesInfo[ave];
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
});

function procesarCamara() {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    setTimeout(procesarCamara, 20);
}
//Funcion Capturar foto
function capturarFoto() {
    const context = canvas.getContext('2d')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    const dataUrl = canvas.toDataURL('image/png')
    capturedImage.src = dataUrl

    //ocultar video
    canvas.style.display = 'none'
    capturedImage.style.display = 'block'
    captureButton.style.display = 'none'
    retomarButton.style.display = 'block'
    //mostrar resultados
    prediccion.style.display = 'block'
    btnDetectar.style.display = 'block'
    

}
var sound = new Audio();
sound.src = "public/snap.mp3";

captureButton.addEventListener("click", capturarFoto);
captureButton.addEventListener("click", predecir);

/*guardar*/

const saveButton = document.getElementById('saveButton');

let birdIdentified = false;

captureButton.addEventListener('click', () => {
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    capturedImage.src = canvas.toDataURL('image/png');
    capturedImage.style.display = 'block';
    video.style.display = 'none';
    captureButton.style.display = 'none';
    retomarButton.style.display = 'inline';
});



//Funcion volver a la camara
function retomarCamara() {
    canvas.style.display = 'block'
    capturedImage.style.display = 'none'
    retomarButton.style.display = 'none'
    prediccion.style.display = 'none'
    saveButton.style.display = 'none'
}
retomarButton.addEventListener('click', retomarCamara);



cargarModelo();
mostrarCamara();