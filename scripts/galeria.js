const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const resultado = document.getElementById('resultado');
const infoAve = document.getElementById("info-ave");
const btnDetectar = document.getElementById('btn-detectar');

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

let modelo = null;
let lastPrediction = null;
let stablePredictionTime = 0;
const predictionThreshold = 3000; // 3 segundos
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
        preview.alt = "Vista previa de la imagen seleccionada";
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
            stablePredictionTime += 500;
            if (stablePredictionTime >= predictionThreshold) {
                btnDetectar.classList.add("activo");
                btnDetectar.disabled = false;
            }
        } else {
            stablePredictionTime = 0;
            btnDetectar.classList.remove("activo");
            btnDetectar.disabled = true;
        }
    }
});
async function cargarDatosAve(ave) {
    const response = await fetch("aves-datos.txt");
    const data = await response.text();
    const avesInfo = JSON.parse(data);
    console.log("avesInfo:", avesInfo);
    if (avesInfo[ave]) {
        const datos = avesInfo[ave];
        infoAve.innerHTML = `
            <h3>${ave}</h3>
            <p><strong>Descripción:</strong> ${datos.descripcion}</p>
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
cargarModelo();