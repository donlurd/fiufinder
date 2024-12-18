const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const resultado = document.getElementById('resultado');
const infoAve = document.getElementById("info-ave");
const btnDetectar = document.getElementById("btn-detectar");


var modelo = null;
(async () => {
    console.log("Cargando modelo...");
    modelo = await tf.loadGraphModel("model.json");
    console.log("Modelo cargado...");
})();

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        // Crear una URL para previsualizar la imagen
        const imageURL = URL.createObjectURL(file);
        preview.src = imageURL;
        preview.alt = "Preview of the selected image";
    }
});



preview.addEventListener('load', async () => {
    const image = tf.browser.fromPixels(preview);
    const processedImage = tf.image.resizeBilinear(image, [224, 224]);
    const input = tf.expandDims(processedImage.toFloat().div(255), 0);
    const prediction = await modelo.predict(input).data();
    const valorPrediction = Math.max(...prediction)
    if (valorPrediction < 0.8) {
        resultado.textContent = `No se detectó ninguna ave`;
        btnDetectar.style.display = "none"
        infoAve.style.display = "none"
    } else {
        const maxPredictionIndex = prediction.indexOf(Math.max(...prediction));
        const clases = ['Cóndor', 'Huala', 'Tórtola'];
        const prediccion = clases[maxPredictionIndex];
        console.log("Predicción", prediccion);
        resultado.textContent = `Predicción: ${prediccion}`;
        btnDetectar.style.display = "block"
        infoAve.style.display = "block"

        if (prediccion) {
            btnDetectar.classList.add("activo");
            btnDetectar.disabled = false;
        } else {
            btnDetectar.classList.remove("activo");
            btnDetectar.disabled = true;
        }
    }
});

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
    if (resultado.textContent) {
        cargarDatosAve(resultado.textContent.split(":")[1].trim());
    }
});