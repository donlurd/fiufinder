import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";

const auth = getAuth();

document.getElementById("registerForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("Usuario registrado:", user);
            alert("Registro exitoso. Ahora puedes iniciar sesión.");
            window.location.href = "login.html"; // Redirigir al login
        })
        .catch((error) => {
            console.error("Error al registrar usuario:", error);
            const errorMsg = document.getElementById("registerError");
            errorMsg.style.display = "block";
            errorMsg.textContent = "Error al registrar el usuario. Intenta de nuevo.";
        });
});
