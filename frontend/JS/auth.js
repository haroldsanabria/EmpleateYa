// REGISTRO
function getUsers(){ return JSON.parse(localStorage.getItem('empleateya_users') || '[]'); }
function saveUsers(list){ localStorage.setItem('empleateya_users', JSON.stringify(list)); }

// ─── REGISTRO (registro.html) ───
if (document.getElementById('formRegistro')) {

  document.getElementById('formRegistro').addEventListener('submit', e => {

    e.preventDefault();

    const tipo = document.getElementById('regTipo').value;

    const nombre = document.getElementById('regNombre').value.trim();
    const documento = document.getElementById('regDocumento').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const pass = document.getElementById('regPass').value;
    const ciudad = document.getElementById('regCiudad').value.trim();

    let nuevoUsuario = {
      tipo,
      nombre,
      documento,
      email,
      pass,
      ciudad
    };

    if (tipo === 'usuario') {
      nuevoUsuario.experiencia = document.getElementById('regExperiencia').value.trim();
    } else {
      nuevoUsuario.experiencia = 'Empresa';
    }

    fetch('https://empleateya-w20x.onrender.com/registro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombre: nombre,
        num_documento_identidad: documento,
        correo: email,
        contraseña: pass,
        ciudad: ciudad,
        experiencia: nuevoUsuario.experiencia
      })
    })

    .then(response => response.text())

    .then(data => {

      localStorage.setItem('empleateya_user', JSON.stringify(nuevoUsuario));

      alert('Cuenta creada con éxito');

      window.location.href =
        (tipo === 'empresa')
        ? 'empresa.html'
        : 'usuario.html';

    })

    .catch(error => {

      console.error(error);
      alert('Error al registrar usuario');

    });

  });

}

// ─── LOGIN (login.html) ───

if (document.getElementById('formLogin')) {

  document.getElementById('formLogin').addEventListener('submit', e => {

    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const pass = document.getElementById('loginPass').value;

    fetch('https://empleateya-w20x.onrender.com/login', {

      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        correo: email,
        contraseña: pass
      })

    })

    .then(response => response.json())

    .then(resultado => {

      if (resultado.success) {

        localStorage.setItem(
          'empleateya_user',
          JSON.stringify(resultado.usuario)
        );

        alert('Bienvenido');

        window.location.href = 'usuario.html';

      } else {

        alert(resultado.mensaje);

      }

    })

    .catch(error => {

      console.error(error);
      alert('Error al iniciar sesión');

    });

  });

}