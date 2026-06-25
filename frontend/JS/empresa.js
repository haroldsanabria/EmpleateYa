// JS/empresa.js - publicar oferta y ver candidatos

function getUsers(){ return JSON.parse(localStorage.getItem('empleateya_users') || '[]'); }
function getOffers(){ return JSON.parse(localStorage.getItem('empleateya_offers') || '[]'); }
function saveOffers(list){ localStorage.setItem('empleateya_offers', JSON.stringify(list)); }

// Publicar oferta (publicar_oferta.html)
if(document.getElementById('formOferta')){
  document.getElementById('formOferta').addEventListener('submit', e=>{
    e.preventDefault();
    const titulo = document.getElementById('ofertaTitulo').value.trim();
    const ubic = document.getElementById('ofertaUbicacion').value.trim();
    const area = document.getElementById('ofertaArea').value;
    const desc = document.getElementById('ofertaDesc').value.trim();
    const offers = getOffers();
    const user = JSON.parse(localStorage.getItem('empleateya_user') || '{}');
    offers.push({ titulo, ubicacion: ubic, area, descripcion: desc, empresa: user?.nombre || 'Empresa' });
    saveOffers(offers);
    alert('Oferta publicada');
    window.location.href = 'empresa.html';
  });
}

// Cargar candidatos (empresa.html)
function cargarCandidatos(){
  const cont = document.getElementById('listaCandidatos'); if(!cont) return;
  const users = getUsers().filter(u => u.tipo === 'usuario');
  cont.innerHTML = '';
  users.forEach(u => {
    const d = document.createElement('div');
    d.className = 'card';
    d.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center">
      <div><strong>${u.nombre}</strong><div style="font-size:0.9rem;color:#cfe9d1">${u.profesion || ''} • ${u.busqueda || ''}</div></div>
      <div><button class="boton" onclick="alert('Contacto: ${u.email}')">Contactar</button></div>
    </div>`;
    cont.appendChild(d);
  });
}

// Perfil empresa (perfil_empresa.html)
if(document.getElementById('perfilEmpresaForm')){
  const user = JSON.parse(localStorage.getItem('empleateya_user') || 'null');
  document.getElementById('empresaNombre').value = user?.nombre || '';
  document.getElementById('empresaDireccion').value = user?.direccion || '';
  document.getElementById('empresaFoto').value = user?.foto || '';

  document.getElementById('perfilEmpresaForm').addEventListener('submit', e=>{
    e.preventDefault();
    const u = JSON.parse(localStorage.getItem('empleateya_user'));
    u.nombre = document.getElementById('empresaNombre').value;
    u.direccion = document.getElementById('empresaDireccion').value;
    u.foto = document.getElementById('empresaFoto').value;
    localStorage.setItem('empleateya_user', JSON.stringify(u));
    let users = getUsers();
    users = users.map(x => x.email === u.email ? u : x);
    localStorage.setItem('empleateya_users', JSON.stringify(users));
    alert('Perfil empresa guardado');
  });
}
function cerrarSesion(){
    localStorage.removeItem("empleateya_user");
    localStorage.removeItem("empleateya_empresa");
    window.location.href = "index.html"; // vuelves al login/registro
}
