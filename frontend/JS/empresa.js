function postularme(ofertaId, tituloOferta){

    const user = JSON.parse(localStorage.getItem('empleateya_user') || 'null');

    if(!user || user.tipo !== 'usuario'){
        alert("Debes iniciar sesión como usuario.");
        return;
    }

    let postulaciones = getPostulaciones();

    const existe = postulaciones.find(p =>
        p.ofertaId === ofertaId &&
        p.email === user.email
    );

    if(existe){
        alert("Ya te postulaste a esta oferta.");
        return;
    }

    postulaciones.push({

        id: Date.now(),

        ofertaId,

        tituloOferta,

        nombre: user.nombre,

        documento: user.documento || "",

        email: user.email,

        telefono: user.telefono || user.whatsapp || "",

        ciudad: user.ciudad || "",

        profesion: user.profesion || "",

        experiencia: user.experiencia || "",

        busqueda: user.busqueda || "",

        foto: user.foto || "",

        fecha: new Date().toLocaleString(),

        estado: "Pendiente"

    });

    savePostulaciones(postulaciones);

    alert("¡Te postulaste correctamente!");

    renderPostulaciones();

    const modal = document.getElementById("modalDetalle");

    if(modal) modal.remove();

}
function togglePostulantes(ofertaId, postulantes){

    const cont = document.getElementById("postulantes-" + ofertaId);

    if(!cont) return;

    if(cont.style.display === "flex"){

        cont.style.display = "none";

        return;

    }

    cont.style.display = "flex";
    cont.style.flexDirection = "column";
    cont.style.gap = "15px";

    if(postulantes.length === 0){

        cont.innerHTML = `
            <div class="card">
                <h3>No hay postulaciones</h3>
                <p>Todavía ningún usuario se ha postulado a esta oferta.</p>
            </div>
        `;

        return;
    }

    cont.innerHTML = "";

    postulantes.forEach(p=>{

        const tarjeta = document.createElement("div");

        tarjeta.className = "card";

        tarjeta.innerHTML = `

            <h3>${p.nombre}</h3>

            <hr>

            <p><strong>📄 Documento:</strong> ${p.documento || "No registrado"}</p>

            <p><strong>📧 Correo:</strong> ${p.email}</p>

            <p><strong>📱 Teléfono:</strong> ${p.telefono || "No registrado"}</p>

            <p><strong>📍 Ciudad:</strong> ${p.ciudad || "No registrada"}</p>

            <p><strong>💼 Profesión:</strong> ${p.profesion || "No registrada"}</p>

            <p><strong>🎯 Empleo buscado:</strong> ${p.busqueda || "No especificado"}</p>

            <p><strong>📝 Estado:</strong> ${p.estado}</p>

            <p><strong>📅 Fecha:</strong> ${p.fecha}</p>

            <p><strong>📚 Experiencia:</strong></p>

            <div style="background:#f5f5f5;padding:10px;border-radius:8px;color:#333">
                ${p.experiencia || "Sin experiencia registrada"}
            </div>

            <br>

            <div style="display:flex;gap:10px">

                <a
                    class="boton"
                    target="_blank"
                    href="https://wa.me/57${(p.telefono || "").replace(/[^0-9]/g,"")}">
                    WhatsApp
                </a>

                <button
                    class="boton"
                    style="background:#27ae60"
                    onclick="cambiarEstado(${p.id},'Aceptado')">

                    Aceptar

                </button>

                <button
                    class="boton"
                    style="background:#c0392b"
                    onclick="cambiarEstado(${p.id},'Rechazado')">

                    Rechazar

                </button>

            </div>

        `;

        cont.appendChild(tarjeta);

    });

}
function cambiarEstado(idPostulacion, nuevoEstado){

    let postulaciones = getPostulaciones();

    postulaciones = postulaciones.map(post => {

        if(post.id == idPostulacion){

            post.estado = nuevoEstado;

        }

        return post;

    });

    savePostulaciones(postulaciones);

    renderMisOfertas();

    if(nuevoEstado === "Aceptado"){

        alert("✅ El candidato fue aceptado.");

    }else{

        alert("❌ El candidato fue rechazado.");

    }

}