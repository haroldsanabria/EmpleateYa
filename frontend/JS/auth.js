// REGISTRO

if (document.getElementById('formRegistro')) {

    const form = document.getElementById('formRegistro');

    form.addEventListener('submit', async (e) => {

        e.preventDefault();

        const datos = {
            nombre: document.getElementById('regNombre').value,
            num_documento_identidad: document.getElementById('regDocumento').value,
            correo: document.getElementById('regEmail').value,
            contraseña: document.getElementById('regPass').value,
            ciudad: document.getElementById('regCiudad').value,
            experiencia: document.getElementById('regExperiencia').value
        };

        try {

            const respuesta = await fetch('http://localhost:3000/registro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            });

            const mensaje = await respuesta.text();

            alert(mensaje);

            window.location.href = 'login.html';

        } catch (error) {

            console.error(error);
            alert('Error al registrar usuario');

        }

    });

}


// LOGIN

if (document.getElementById('formLogin')) {

    const form = document.getElementById('formLogin');

    form.addEventListener('submit', async (e) => {

        e.preventDefault();

        const datos = {
            correo: document.getElementById('loginEmail').value,
            contraseña: document.getElementById('loginPass').value
        };

        try {

            const respuesta = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            });

            const resultado = await respuesta.json();

            if (resultado.success) {

                alert('Bienvenido');
                window.location.href = 'opciones.html';

            } else {

                alert(resultado.mensaje);

            }

        } catch (error) {

            console.error(error);
            alert('Error al iniciar sesión');

        }

    });

}
