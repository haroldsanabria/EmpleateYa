// JS/auth.js - registro y login usando localStorage simple

function getUsers(){
  return JSON.parse(localStorage.getItem('empleateya_users') || '[]');
}
function saveUsers(list){ localStorage.setItem('empleateya_users', JSON.stringify(list)); }

// REGISTRO (registro.html)
if(document.getElementById('formRegistro')){
  const form = document.getElementById('formRegistro');
  const tipoSelect = document.getElementById('tipoCuenta');

  tipoSelect.addEventListener('change', ()=>{
    const show = tipoSelect.value === 'empresa';
    document.getElementById('regDireccion').style.display = show ? 'block' : 'none';
    document.getElementById('regFoto').style.display = show ? 'block' : 'none';
  });

  form.addEventListener('submit', e=>{
    e.preventDefault();
    const tipo = document.getElementById('tipoCuenta').value;
    const nombre = document.getElementById('regNombre').value.trim();
    const email = document.getElementById('regEmail').value.trim().toLowerCase();
    const pass = document.getElementById('regPass').value;
    const direccion = document.getElementById('regDireccion').value || '';
    const foto = document.getElementById('regFoto').value || '';

    const users = getUsers();
    if(users.find(u => u.email === email)){
      alert('Ese correo ya está registrado');
      return;
    }

    const newUser = { tipo, nombre, email, pass, direccion, foto, creado: Date.now() };
    users.push(newUser);
    saveUsers(users);

    // Guardar sesión
    localStorage.setItem('empleateya_user', JSON.stringify(newUser));
    window.location.href = 'opciones.html';
  });
}

// LOGIN (login.html)
if(document.getElementById('formLogin')){
  const form = document.getElementById('formLogin');
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const pass = document.getElementById('loginPass').value;
    const users = getUsers();
    const u = users.find(x => x.email === email && x.pass === pass);
    if(!u){ alert('Credenciales incorrectas'); return; }
    localStorage.setItem('empleateya_user', JSON.stringify(u));
    window.location.href = 'opciones.html';
  });
}
function cerrarSesion() {
    // Borrar cualquier usuario o empresa activa
    localStorage.removeItem("usuarioActivo");
    localStorage.removeItem("empresaActiva");

    // Volver al formulario de registro
    document.getElementById("registro").style.display = "block";
    document.getElementById("dashboard").style.display = "none";

    // Reset form (opcional)
    const forms = document.querySelectorAll("form");
    forms.forEach(f => f.reset());
}

