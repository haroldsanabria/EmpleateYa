// REGISTRO
function getUsers(){ return JSON.parse(localStorage.getItem('empleateya_users') || '[]'); }
function saveUsers(list){ localStorage.setItem('empleateya_users', JSON.stringify(list)); }

// ─── REGISTRO (registro.html) ───
if (document.getElementById('formRegistro')) {
  document.getElementById('formRegistro').addEventListener('submit', e => {
    e.preventDefault();

    const tipo = document.getElementById('regTipo').value; // 'usuario' o 'empresa'

    // Campos comunes
    const nombre = document.getElementById('regNombre').value.trim();
    const documento = document.getElementById('regDocumento').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const pass = document.getElementById('regPass').value;
    const ciudad = document.getElementById('regCiudad').value.trim();

    // Validar email duplicado
    const users = getUsers();
    if (users.some(u => u.email === email)) {
      alert('Ya existe una cuenta con ese correo.');
      return;
    }

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
      nuevoUsuario.profesion   = document.getElementById('regProfesion').value.trim();
      nuevoUsuario.busqueda    = document.getElementById('regBusqueda').value.trim();
    } else {
      nuevoUsuario.nombreEmpresa = document.getElementById('empNombreEmpresa').value.trim();
      nuevoUsuario.direccion     = document.getElementById('empDireccion').value.trim();
      nuevoUsuario.whatsapp      = document.getElementById('empWhatsapp').value.trim();
      nuevoUsuario.sector        = document.getElementById('empSector').value;
      nuevoUsuario.nit           = document.getElementById('empNit').value.trim();
      nuevoUsuario.descripcion   = document.getElementById('empDescripcion').value.trim();
      // El "nombre" visible para empresa será el de la empresa
      nuevoUsuario.nombre = nuevoUsuario.nombreEmpresa || nombre;
    }

    users.push(nuevoUsuario);
    saveUsers(users);

    // Inicia sesión automáticamente tras registrarse
    localStorage.setItem('empleateya_user', JSON.stringify(nuevoUsuario));

    alert('Cuenta creada con éxito');
    window.location.href = (tipo === 'empresa') ? 'empresa.html' : 'usuario.html';
  });
}

// ─── LOGIN (login.html) ───
if (document.getElementById('formLogin')) {
  document.getElementById('formLogin').addEventListener('submit', e => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const pass  = document.getElementById('loginPass').value;

    const users = getUsers();
    const encontrado = users.find(u => u.email === email && u.pass === pass);

    if (!encontrado) {
      alert('Correo o contraseña incorrectos.');
      return;
    }

    localStorage.setItem('empleateya_user', JSON.stringify(encontrado));
    window.location.href = (encontrado.tipo === 'empresa') ? 'empresa.html' : 'usuario.html';
  });
}