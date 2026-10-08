const formulario = document.querySelector(".contact-form");

formulario.addEventListener("submit", (event) => {
    event.preventDefault();//Evita que el formulario se envíe automáticamente

    const nombre = document.getElementById("name").value;
    const edad = document.getElementById("age").value;
    const correo = document.getElementById("email").value;
    const mensaje = document.getElementById("message").value;

    const patronNombre = /^[a-zA-Z\s]+$/; // Expresión regular para permitir solo letras y espacios
    //const patronEdad = /^\d+$/; // Expresión regular para permitir solo números
    //const patronEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para validar correo electrónico
    //const patronMensaje = /^.{10,}$/; // Expresión regular para permitir mensajes de al menos 10 caracteres 

    if (nombre === ""  || !patronNombre.test(nombre)) {
        //alert("Por favor, ingresa tu nombre.");
        document.getElementById("errorNombre").textContent = "Por favor, ingresa tu nombre.";
        //return;
    }

    if (edad === "" || isNaN(edad) || edad < 18) {
        //alert("Por favor, ingresa una edad válida (mayor de 18 años).");
        document.getElementById("errorEdad").textContent = "Por favor, ingresa una edad válida (mayor de 18 años).";
        //return;
    }

    if (correo === "" || !correo.includes("@")) {
        //alert("Por favor, ingresa un correo electrónico válido.");
        document.getElementById("errorEmail").textContent = "Por favor, ingresa un correo electrónico válido.";
        //return;
    }

    if (mensaje === "") { 
        //alert("Por favor, ingresa un mensaje.");
        document.getElementById("errorMensaje").textContent = "Por favor, ingresa un mensaje.";
        //return;
    }

})