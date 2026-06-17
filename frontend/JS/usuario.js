// =============================================
//   JS/usuario.js - ofertas, filtros y perfil
// =============================================

// ---- Manejo de ofertas ----
function getOffers(){
  return JSON.parse(localStorage.getItem('empleateya_offers') || '[]');
}
function saveOffers(list){
  localStorage.setItem('empleateya_offers', JSON.stringify(list));
}


// ========== RENDERIZAR OFERTAS (usuario.html) ==========
function renderOffers(list){
  const cont = document.getElementById('listaOfertas');
  if(!cont) return;

  cont.innerHTML = '';

  list.forEach((of, index) => {
    const div = document.createElement('div');
    div.className = 'card';
    div.style.cursor = "pointer";

    // 🔥 NUEVO → guardar ID temporal para abrir la descripción
    div.addEventListener("click", () => {
      localStorage.setItem("empleateya_selected_offer", index);
      window.location.href = "descripcion_oferta.html";
    });

    div.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px">
        <div style="flex:1">
          <strong>${of.titulo}</strong>
          <div style="font-size:0.9rem;color:#cfe9d1">
            ${of.empresa || ''} • ${of.ubicacion || ''}
          </div>
        </div>
        <div>${of.area || ''}</div>
      </div>
      <p style="margin-top:8px;color:#dfeee0">
        ${of.descripcion || ''}
      </p>
    `;
    cont.appendChild(div);
  });
}


// ========== CARGAR OFERTAS DESDE SQL SERVER ==========
if(document.getElementById('listaOfertas')){

  let all = [];

  fetch('http://localhost:3000/ofertas')
    .then(res => res.json())
    .then(data => {

      all = data;

      renderOffers(all);

      const search = document.getElementById('search');

      search.addEventListener('input', e => {

        const q = e.target.value.toLowerCase();

        const filtered = all.filter(o =>
          (
            (o.titulo || '') +
            (o.empresa || '') +
            (o.ubicacion || '')
          ).toLowerCase().includes(q)
        );

        renderOffers(filtered);

      });

    })
    .catch(err => {
      console.error(err);
      alert('Error al cargar ofertas');
    });

}


// ========== FILTRO POR ÁREA ==========
function aplicarFiltro(){

    const area = document.getElementById('filtroArea').value;

    fetch('http://localhost:3000/ofertas')
        .then(res => res.json())
        .then(data => {

            if(!area){
                renderOffers(data);
            }else{
                renderOffers(
                    data.filter(o => o.area === area)
                );
            }

        });

}



// =====================================================
//      PERFIL DEL USUARIO (perfil_usuario.html)
// =====================================================
if(document.getElementById('perfilForm')){
  const user = JSON.parse(localStorage.getItem('empleateya_user') || 'null');

  document.getElementById('perfilNombre').value = user?.nombre || '';
  document.getElementById('perfilApellido').value = user?.apellido || '';
  document.getElementById('perfilProfesion').value = user?.profesion || '';
  document.getElementById('perfilDedicacion').value = user?.dedicacion || '';
  document.getElementById('perfilBusqueda').value = user?.busqueda || '';

  document.getElementById('perfilForm').addEventListener('submit', e=>{
    e.preventDefault();

    const u = JSON.parse(localStorage.getItem('empleateya_user'));
    u.nombre = document.getElementById('perfilNombre').value;
    u.apellido = document.getElementById('perfilApellido').value;
    u.profesion = document.getElementById('perfilProfesion').value;
    u.dedicacion = document.getElementById('perfilDedicacion').value;
    u.busqueda = document.getElementById('perfilBusqueda').value;

    localStorage.setItem('empleateya_user', JSON.stringify(u));

    // actualizar en lista global
    let users = JSON.parse(localStorage.getItem('empleateya_users') || '[]');
    users = users.map(x => x.email === u.email ? u : x);
    localStorage.setItem('empleateya_users', JSON.stringify(users));

    alert('Perfil guardado');
  });
}
if(document.getElementById("detalleTitulo")){
  const index = localStorage.getItem("empleateya_selected_offer");

  if(index === null){
    document.body.innerHTML = "<h2>Error: no se seleccionó oferta</h2>";
  } else {
    const offers = getOffers();
    const of = offers[index];

    document.getElementById("detalleTitulo").innerText = of.titulo;
    document.getElementById("detalleEmpresa").innerText = of.empresa;
    document.getElementById("detalleUbicacion").innerText = of.ubicacion;
    document.getElementById("detalleArea").innerText = of.area;
    document.getElementById("detalleDescripcion").innerText = of.descripcion;
  }
}
function cerrarSesion(){
    localStorage.removeItem("empleateya_user");
    localStorage.removeItem("empleateya_empresa");
    window.location.href = "index.html"; // vuelves al login/registro
}
