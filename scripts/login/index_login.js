import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";

const auth = getAuth();
const authButtonContainer = document.getElementById("auth-button");

// Detectar el estado de autenticación
onAuthStateChanged(auth, (user) => {
    authButtonContainer.innerHTML = ""; // Limpiar contenido previo

    if (user) {
        // Mostrar botón de Logout si el usuario está autenticado
        const logoutButton = document.createElement("button");
        logoutButton.textContent = "Cerrar Sesión";
        logoutButton.className = "auth-button logout";
        logoutButton.addEventListener("click", () => {
            signOut(auth)
                .then(() => {
                    alert("Has cerrado sesión.");
                })
                .catch((error) => {
                    console.error("Error al cerrar sesión:", error);
                });
        });

        // Mostrar botón de Perfil si el usuario está autenticado
        const profileButton = document.createElement("a");
        profileButton.textContent = "Perfil";
        profileButton.href = "perfil.html";
        profileButton.className = "auth-button profile";

        authButtonContainer.appendChild(profileButton);
        authButtonContainer.appendChild(logoutButton);
    } else {
        // Mostrar botón de Login si el usuario no está autenticado
        const loginButton = document.createElement("a");
        loginButton.textContent = "Iniciar Sesión";
        loginButton.href = "login.html";
        loginButton.className = "auth-button login";
        authButtonContainer.appendChild(loginButton);
    }
});