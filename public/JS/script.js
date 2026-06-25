console.log("Script cargado correctamente");

// --- MOSTRAR DASHBOARD ---
function mostrarDashboard(e) {
    e.preventDefault();

    localStorage.setItem("usuarioActivo", "true");

    document.getElementById("registro").style.display = "none";
    document.getElementById("dashboard").style.display = "block";

    console.log("Sesión iniciada");
}

// --- CERRAR SESIÓN ---
function cerrarSesion() {
    console.log("Intentando cerrar sesión...");

    localStorage.removeItem("usuarioActivo");

    document.getElementById("dashboard").style.display = "none";
    document.getElementById("registro").style.display = "block";

    console.log("Sesión cerrada");
}

// --- CONTROL DE SESIÓN AL CARGAR ---
window.onload = function () {
    console.log("Página recargada");

    const user = localStorage.getItem("usuarioActivo");

    if (user) {
        console.log("Había sesión iniciada");
        document.getElementById("registro").style.display = "none";
        document.getElementById("dashboard").style.display = "block";
    } else {
        console.log("No hay sesión iniciada");
        document.getElementById("registro").style.display = "block";
        document.getElementById("dashboard").style.display = "none";
    }
};
