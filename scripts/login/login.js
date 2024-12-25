import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";

const auth = getAuth();

document.getElementById("loginForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("Usuario autenticado:", user);
            localStorage.setItem("usuario", JSON.stringify(user));
            alert("Inicio de sesión exitoso");
            window.location.href = "index.html"; // Redirigir al index
        })
        .catch((error) => {
            console.error("Error al iniciar sesión:", error);
            const errorMsg = document.getElementById("loginError");
            errorMsg.style.display = "block";
            errorMsg.textContent = "Correo o contraseña incorrectos";
        });
});
