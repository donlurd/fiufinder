const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
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
            const normalized = resized.toFloat().div(255.0);
            return normalized.expandDims(0);
        });

        const prediction = await modelo.predict(inputTensor).data();
        console.log("valors:", prediction);
        console.log("max:", Math.max(...prediction));
        const valorPrediction = Math.max(...prediction);
        if (valorPrediction < 0.8) {
            resultado.textContent = `No se detectó ninguna ave`;
            btnDetectar.style.display = "none"
            infoAve.style.display= "none"
        } else {
            const maxPredictionIndex = prediction.indexOf(Math.max(...prediction));
            console.log("maxPredictionIndex:", maxPredictionIndex);
            const clases = ["agu","chi","com","con","mtp","pjh","peu","tiu","ttc","ndu"];
            const prediccionActual = clases[maxPredictionIndex];

            resultado.textContent = `Predicción: ${prediccionActual}`;
            btnDetectar.style.display = "block"
            infoAve.style.display= "block"

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

            lastPrediction = prediccionActual;
            tf.dispose(inputTensor);
        }
    }
    setTimeout(predecir, 500);
}
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

}
captureButton.addEventListener("click", capturarFoto);

//Funcion volver a la camara
function retomarCamara() {
    canvas.style.display = 'block'
    capturedImage.style.display = 'none'
    captureButton.style.display = 'block'
    retomarButton.style.display = 'none'
    prediccion.style.display = 'none'
}
retomarButton.addEventListener('click', retomarCamara);


// Cargar información del ave desde el archivo
async function cargarDatosAve(ave) {
    const response = await fetch("aves-datos.txt");
    const data = await response.text();
    const avesInfo = JSON.parse(data);
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
mostrarCamara();