import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";

const auth = getAuth();

const form = document.getElementById("registerForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const showPasswordsCheckbox = document.getElementById("showPasswords");
const errorElement = document.getElementById("registerError");

// Validar contraseña
const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
};

// Mostrar/ocultar contraseñas
showPasswordsCheckbox.addEventListener("change", () => {
    const isChecked = showPasswordsCheckbox.checked;
    passwordInput.type = isChecked ? "text" : "password";
    confirmPasswordInput.type = isChecked ? "text" : "password";
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    // Validar contraseñas
    if (!validatePassword(password)) {
        errorElement.textContent = "La contraseña no cumple con los requisitos. Debe tener al menos 8 caracteres, una letra mayúscula, una minúscula, un número y un carácter especial.";
        errorElement.style.display = "block";
        errorElement.style.color = "red";
        return;
    }

    if (password !== confirmPassword) {
        errorElement.textContent = "Las contraseñas no coinciden. Por favor, verifica e inténtalo de nuevo.";
        errorElement.style.display = "block";
        errorElement.style.color = "red";
        return;
    }

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        errorElement.textContent = "Registro exitoso. Ahora puedes iniciar sesión.";
        errorElement.style.display = "block";
        errorElement.style.color = "green";
        setTimeout(() => {
            window.location.href = "login.html"; // Redirigir al login
        }, 2000);
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        let message;
        switch (error.code) {
            case "auth/email-already-in-use":
                message = "El correo ya está en uso. Por favor, intenta con otro.";
                break;
            case "auth/invalid-email":
                message = "El correo no es válido. Por favor, verifica e inténtalo de nuevo.";
                break;
            case "auth/weak-password":
                message = "La contraseña es demasiado débil. Por favor, utiliza una contraseña más segura.";
                break;
            default:
                message = "Ocurrió un error inesperado. Por favor, inténtalo de nuevo.";
        }
        errorElement.textContent = message;
        errorElement.style.display = "block";
        errorElement.style.color = "red";
    }
});
