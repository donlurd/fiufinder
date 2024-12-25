import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";

const auth = getAuth();

document.addEventListener("DOMContentLoaded", () => {
    const authButtonContainer = document.getElementById("auth-button");

    onAuthStateChanged(auth, (user) => {
        authButtonContainer.innerHTML = ""; // Limpiar contenido previo

        if (user) {
            // Usuario autenticado: mostrar botón de cerrar sesión
            const logoutButton = document.createElement("button");
            logoutButton.textContent = "Cerrar Sesión";
            logoutButton.className = "auth-button logout";
            logoutButton.addEventListener("click", async () => {
                try {
                    await signOut(auth);
                    alert("Has cerrado sesión.");
                    window.location.href = "index.html"; // Redirigir al inicio
                } catch (error) {
                    console.error("Error al cerrar sesión:", error);
                }
            });
            authButtonContainer.appendChild(logoutButton);
        } else {
            // Usuario no autenticado: mostrar botón de iniciar sesión
            const loginButton = document.createElement("a");
            loginButton.textContent = "Iniciar Sesión";
            loginButton.href = "login.html";
            loginButton.className = "auth-button login";
            authButtonContainer.appendChild(loginButton);
        }
    });
});