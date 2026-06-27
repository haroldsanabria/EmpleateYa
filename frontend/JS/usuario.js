function getPostulaciones(){ return JSON.parse(localStorage.getItem('empleateya_postulaciones')||'[]'); }
function savePostulaciones(l){ localStorage.setItem('empleateya_postulaciones',JSON.stringify(l)); }

let ofertasActuales=[];
let filtroModalidadVal='';
let filtroContratoVal='';
let filtroSalarioVal=0;

function colorInicial(n){
  const c=['linear-gradient(135deg,#0f5c2e,#48e07b)','linear-gradient(135deg,#0c4478,#378add)',
    'linear-gradient(135deg,#5c1b8f,#a855f7)','linear-gradient(135deg,#7c1d1d,#e24b4a)',
    'linear-gradient(135deg,#5c4a00,#ba7517)','linear-gradient(135deg,#0a3d52,#1d9e75)'];
  return c[(n||'E').charCodeAt(0)%c.length];
}

function tiempoRelativo(fecha){
  if(!fecha) return '';
  const diff=Date.now()-new Date(fecha).getTime();
  const d=Math.floor(diff/86400000);
  if(d===0) return '🕐 Hoy';
  if(d===1) return '🕐 Ayer';
  if(d<7) return '🕐 Hace '+d+' días';
  if(d<30) return '🕐 Hace '+(Math.floor(d/7))+' semana(s)';
  return '🕐 Hace '+(Math.floor(d/30))+' mes(es)';
}

function renderOfertas(lista){
  const cont=document.getElementById('listaOfertas');
  const contador=document.getElementById('contadorOfertas');
  if(!cont) return;
  if(contador) contador.textContent=lista.length+' oferta(s) encontrada(s)';
  cont.innerHTML='';
  if(lista.length===0){ cont.innerHTML='<p class="empty-msg">No hay ofertas con esos filtros.</p>'; return; }
  lista.forEach((o,i)=>{
    const salario=(o.salarioMin||o.salarioMax)
      ?'$'+Number(o.salarioMin||0).toLocaleString('es-CO')+' a $'+Number(o.salarioMax||0).toLocaleString('es-CO'):null;
    const card=document.createElement('div');
    card.className='arbol-card';
    card.innerHTML=
      '<div class="ac-header">'+
        '<div class="ac-inicial" style="background:'+colorInicial(o.empresa||'E')+'">'+(o.empresa||'E')[0].toUpperCase()+'</div>'+
        '<div class="ac-top">'+
          '<h3 class="ac-titulo">'+(o.titulo||'Sin título')+'</h3>'+
          '<span class="ac-empresa">'+(o.empresa||'Empresa')+'</span>'+
        '</div>'+
      '</div>'+
      '<div class="ac-datos">'+
        (salario?'<div class="ac-dato"><span class="ac-dato-val salario">'+salario+'</span><span class="ac-dato-label">Salario</span></div>':'')+
        (o.tipoContrato?'<div class="ac-dato"><span class="ac-dato-val">'+o.tipoContrato+'</span><span class="ac-dato-label">Tipo de contrato</span></div>':'')+
        (o.ubicacion?'<div class="ac-dato"><span class="ac-dato-val">'+o.ubicacion+'</span><span class="ac-dato-label">Ubicación</span></div>':'')+
        (o.modalidad?'<div class="ac-dato"><span class="ac-dato-val">'+o.modalidad+'</span><span class="ac-dato-label">Modalidad</span></div>':'')+
        (o.experiencia?'<div class="ac-dato"><span class="ac-dato-val">'+o.experiencia+'</span><span class="ac-dato-label">Experiencia</span></div>':'')+
        (o.vacantes?'<div class="ac-dato"><span class="ac-dato-val">'+o.vacantes+'</span><span class="ac-dato-label">Vacantes</span></div>':'')+
      '</div>'+
      '<div class="ac-footer">'+
        '<span class="ac-tiempo">'+(o.fecha?tiempoRelativo(o.fecha):'')+'</span>'+
        '<button class="ac-btn" type="button">Ver y postularme</button>'+
      '</div>';
    card.querySelector('.ac-btn').addEventListener('click',e=>{ e.stopPropagation(); mostrarDetalle(i); });
    card.addEventListener('click',()=>mostrarDetalle(i));
    cont.appendChild(card);
  });
}

function renderPostulaciones(){
  const cont=document.getElementById('listaPostulaciones');
  const contador=document.getElementById('contadorPost');
  const resumen=document.getElementById('resumenPostulaciones');
  if(!cont) return;
  const user=JSON.parse(localStorage.getItem('empleateya_user')||'null');
  const misPosts=user?getPostulaciones().filter(p=>p.email===user.email):[];
  if(contador) contador.textContent=misPosts.length+' postulación(es)';
  if(resumen) resumen.innerHTML=
    '<div class="resumen-item"><span class="resumen-num">'+misPosts.length+'</span><span class="resumen-desc">Total enviadas</span></div>'+
    '<div class="resumen-item"><span class="resumen-num" style="color:#fde047">'+misPosts.filter(p=>!p.vista).length+'</span><span class="resumen-desc">En revisión</span></div>'+
    '<div class="resumen-item"><span class="resumen-num" style="color:#48e07b">'+misPosts.filter(p=>p.cvNombre).length+'</span><span class="resumen-desc">Con CV adjunto</span></div>';

  cont.innerHTML='';
  if(misPosts.length===0){ cont.innerHTML='<p class="empty-msg">Aún no te has postulado a ninguna oferta.<br><button class="boton" style="margin-top:12px" onclick="cambiarPanel(\'ofertas\',document.querySelector(\'.panel-tab\'))">Ver ofertas</button></p>'; return; }
  const ofertas = ofertasActuales;
  misPosts.slice().reverse().forEach(p=>{
    const of=ofertas.find(o=>o.id===p.ofertaId)||{};
    const salario=(of.salarioMin||of.salarioMax)
      ?'$'+Number(of.salarioMin||0).toLocaleString('es-CO')+' a $'+Number(of.salarioMax||0).toLocaleString('es-CO'):null;
    const wn=(of.empresaWhatsapp||'').replace(/[^0-9]/g,'');
    const linkWa=wn?'https://wa.me/57'+wn:'';
    const fecha=p.fecha?new Date(p.fecha).toLocaleDateString('es-CO',{day:'numeric',month:'short',year:'numeric'}):'';
    const card=document.createElement('div');
    card.className='arbol-card post-arbol';
    card.innerHTML=
      '<div class="ac-header">'+
        '<div class="ac-inicial" style="background:'+colorInicial(of.empresa||'E')+'">'+(of.empresa||'E')[0].toUpperCase()+'</div>'+
        '<div class="ac-top">'+
          '<h3 class="ac-titulo">'+(p.tituloOferta||'Oferta')+'</h3>'+
          '<span class="ac-empresa">'+(of.empresa||'Empresa')+(of.empresaSector?' · '+of.empresaSector:'')+'</span>'+
        '</div>'+
        '<span class="post-estado pendiente">⏳ En revisión</span>'+
      '</div>'+
      '<div class="ac-datos">'+
        (salario?'<div class="ac-dato"><span class="ac-dato-val salario">'+salario+'</span><span class="ac-dato-label">Salario</span></div>':'')+
        (of.modalidad?'<div class="ac-dato"><span class="ac-dato-val">'+of.modalidad+'</span><span class="ac-dato-label">Modalidad</span></div>':'')+
        (of.ubicacion?'<div class="ac-dato"><span class="ac-dato-val">'+of.ubicacion+'</span><span class="ac-dato-label">Ubicación</span></div>':'')+
        (p.cvNombre?'<div class="ac-dato"><span class="ac-dato-val">📄 '+p.cvNombre+'</span><span class="ac-dato-label">CV adjunto</span></div>':'')+
        '<div class="ac-dato"><span class="ac-dato-val">'+fecha+'</span><span class="ac-dato-label">Fecha de postulación</span></div>'+
      '</div>'+
      '<div class="ac-footer">'+
        (linkWa?'<a class="ac-btn" href="'+linkWa+'" target="_blank" rel="noopener">💬 Contactar empresa</a>':'<span></span>')+
      '</div>';
    cont.appendChild(card);
  });
}

function mostrarDetalle(index){
  const o=ofertasActuales[index]; if(!o) return;
  const old=document.getElementById('modalDetalle'); if(old) old.remove();
  const wn=(o.empresaWhatsapp||'').replace(/[^0-9]/g,'');
  const msg=encodeURIComponent('Hola, vi tu oferta "'+o.titulo+'" en EmpléateYA y me gustaría aplicar.');
  const linkWa=wn?'https://wa.me/57'+wn+'?text='+msg:null;
  const salario=(o.salarioMin||o.salarioMax)
    ?'$'+Number(o.salarioMin||0).toLocaleString('es-CO')+' a $'+Number(o.salarioMax||0).toLocaleString('es-CO'):null;
  const tags=[o.tipoContrato,o.modalidad,o.experiencia].filter(Boolean);

  const modal=document.createElement('div');
  modal.id='modalDetalle';
  modal.className='modal-overlay';
  modal.innerHTML=
    '<div class="modal-box">'+
      '<button class="modal-cerrar" id="mdCerrar">✕</button>'+
      '<div class="modal-header">'+
        '<div class="ac-inicial modal-inicial" style="background:'+colorInicial(o.empresa||'E')+'">'+(o.empresa||'E')[0].toUpperCase()+'</div>'+
        '<div><h2 class="modal-titulo">'+(o.titulo||'')+'</h2>'+
        '<p class="modal-empresa-nm">'+(o.empresa||'')+(o.empresaSector?' · <em>'+o.empresaSector+'</em>':'')+'</p></div>'+
      '</div>'+
      (tags.length?'<div class="modal-tags">'+tags.map(t=>'<span class="modal-tag">'+t+'</span>').join('')+'</div>':'')+
      '<div class="modal-stats">'+
        (salario?'<div class="modal-stat"><span class="modal-stat-label">Salario</span><span class="modal-stat-val green">'+salario+'</span></div>':'')+
        (o.vacantes?'<div class="modal-stat"><span class="modal-stat-label">Vacantes</span><span class="modal-stat-val">'+o.vacantes+'</span></div>':'')+
        (o.empresaDireccion?'<div class="modal-stat"><span class="modal-stat-label">Ubicación empresa</span><span class="modal-stat-val">📍 '+o.empresaDireccion+'</span></div>':'')+
        (o.empresaSector?'<div class="modal-stat"><span class="modal-stat-label">Sector</span><span class="modal-stat-val">'+o.empresaSector+'</span></div>':'')+
      '</div>'+
      (o.requisitos?'<div class="modal-section"><span class="modal-label">Requisitos</span><p>'+o.requisitos+'</p></div>':'')+
      '<div class="modal-section"><span class="modal-label">Descripción</span><p>'+(o.descripcion||'Sin descripción.')+'</p></div>'+
      '<div class="modal-section modal-cv-section">'+
        '<span class="modal-label">Tu hoja de vida (opcional)</span>'+
        '<label class="cv-upload-label">'+
          '<input type="file" id="cvInput" accept=".pdf,.doc,.docx" style="display:none">'+
          '<span class="cv-upload-btn">📎 Adjuntar CV</span>'+
          '<span class="cv-nombre" id="cvNombre">Ningún archivo seleccionado</span>'+
        '</label>'+
      '</div>'+
      '<div class="modal-acciones">'+
        '<button type="button" class="boton" id="mdPostular">✅ Postularme</button>'+
        (linkWa?'<a class="boton boton-whatsapp" href="'+linkWa+'" target="_blank" rel="noopener">💬 WhatsApp</a>':'')+
      '</div>'+
    '</div>';

  document.body.appendChild(modal);
  modal.addEventListener('click',e=>{ if(e.target===modal) modal.remove(); });
  document.getElementById('mdCerrar').addEventListener('click',()=>modal.remove());
  document.getElementById('cvInput').addEventListener('change',function(){
    document.getElementById('cvNombre').textContent=this.files[0]?this.files[0].name:'Ningún archivo seleccionado';
  });
  document.getElementById('mdPostular').addEventListener('click',()=>{
    const cv=document.getElementById('cvInput');
    postularme(o.id,o.titulo,cv.files[0]?cv.files[0].name:'');
  });
}

function postularme(ofertaId,tituloOferta,cvNombre){
  const user=JSON.parse(localStorage.getItem('empleateya_user')||'null');
  if(!user||user.tipo!=='usuario'){ alert('Debes iniciar sesión como usuario para postularte.'); return; }
  const posts=getPostulaciones();
  if(posts.some(p=>p.ofertaId===ofertaId&&p.email===user.email)){ alert('Ya te postulaste a esta oferta.'); return; }
  posts.push({ ofertaId, tituloOferta, nombre:user.nombre, email:user.email,
    telefono:user.telefono||user.whatsapp||'', profesion:user.profesion||'',
    cvNombre:cvNombre||'', fecha:new Date().toISOString() });
  savePostulaciones(posts);
  alert('¡Postulación enviada!');
  const m=document.getElementById('modalDetalle'); if(m) m.remove();
}
function aplicarFiltro(){

  const txt = (document.getElementById('search')?.value || '').toLowerCase();
  const area = document.getElementById('filtroArea')?.value || '';

  const f = ofertasActuales.filter(o => {

    const t =
      !txt ||
      o.titulo.toLowerCase().includes(txt) ||
      (o.empresa || '').toLowerCase().includes(txt);

    const a = !area || o.area === area;
    const m = !filtroModalidadVal || (o.modalidad || '') === filtroModalidadVal;
    const c = !filtroContratoVal || (o.tipoContrato || '') === filtroContratoVal;
    const s = !filtroSalarioVal || Number(o.salarioMin || 0) >= filtroSalarioVal;

    return t && a && m && c && s;

  });

  renderOfertas(f);

}
function limpiarFiltros(){
  document.getElementById('search').value='';
  document.getElementById('filtroArea').value='';
  filtroModalidadVal=''; filtroContratoVal=''; filtroSalarioVal=0;
  document.querySelectorAll('.chip').forEach(c=>c.classList.remove('activo'));
  document.querySelectorAll('.chip[data-val=""]').forEach(c=>c.classList.add('activo'));
  document.querySelectorAll('#filtroSalario .chip[data-val="0"]').forEach(c=>c.classList.add('activo'));
  fetch('https://empleateya-w20x.onrender.com/ofertas')
  .then(res => res.json())
  .then(datos => {

    ofertasActuales = datos.map(o => ({
      id: o.id_oferta,
      titulo: o.titulo,
      descripcion: o.descripcion,
      empresa: o.empresa,
      salarioMin: o.salario,
      salarioMax: o.salario,
      modalidad: o.modalidad,
      fecha: o.fecha_publicacion
    }));

    renderOfertas(ofertasActuales);

  });
}

function ordenar(tipo,el){
  document.querySelectorAll('.arbol-orden .chip').forEach(c=>c.classList.remove('activo'));
  el.classList.add('activo');
  const lista=[...ofertasActuales];
  if(tipo==='salario') lista.sort((a,b)=>Number(b.salarioMax||0)-Number(a.salarioMax||0));
  else lista.sort((a,b)=>new Date(b.fecha||0)-new Date(a.fecha||0));
  renderOfertas(lista);
}

function cambiarPanel(panel,el){
  document.querySelectorAll('.panel-seccion').forEach(s=>s.classList.remove('visible'));
  document.querySelectorAll('.panel-tab').forEach(t=>t.classList.remove('active'));
  document.getElementById('panel'+panel.charAt(0).toUpperCase()+panel.slice(1)).classList.add('visible');
  el.classList.add('active');
  if(panel==='postulaciones') renderPostulaciones();
}
document.addEventListener('DOMContentLoaded', async ()=>{

  try {

    const respuesta = await fetch('https://empleateya-w20x.onrender.com/ofertas');
    const datos = await respuesta.json();

    ofertasActuales = datos.map(o => ({
      id: o.id_oferta,
      titulo: o.titulo,
      descripcion: o.descripcion,
      empresa: o.empresa,
      salarioMin: o.salario,
      salarioMax: o.salario,
      modalidad: o.modalidad,
      fecha: o.fecha_publicacion
    }));

    renderOfertas(ofertasActuales);

  } catch(error){

    console.error(error);
    alert('Error al cargar ofertas');

  }

  const s=document.getElementById('search');

  if(s) s.addEventListener('input',aplicarFiltro);

  document.querySelectorAll('#filtroModalidad .chip').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('#filtroModalidad .chip').forEach(c=>c.classList.remove('activo'));
      btn.classList.add('activo');
      filtroModalidadVal=btn.dataset.val;
      aplicarFiltro();
    });
  });

  document.querySelectorAll('#filtroContrato .chip').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('#filtroContrato .chip').forEach(c=>c.classList.remove('activo'));
      btn.classList.add('activo');
      filtroContratoVal=btn.dataset.val;
      aplicarFiltro();
    });
  });

  document.querySelectorAll('#filtroSalario .chip').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('#filtroSalario .chip').forEach(c=>c.classList.remove('activo'));
      btn.classList.add('activo');
      filtroSalarioVal=Number(btn.dataset.val);
      aplicarFiltro();
    });
  });

});
