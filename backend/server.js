const express = require('express');
console.log('ESTE ES MI SERVER.JS');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Conexión a Hostinger MySQL
const db = mysql.createPool({
    host: 'auth-db1352.hstgr.io',
    user: 'u956672857_empleateya',
    password: 'EmpleateYa25',
    database: 'u956672857_empleateya',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10
});

// Probar conexión
(async () => {
    try {
        const conexion = await db.getConnection();
        console.log("Conectado a MySQL");
        conexion.release();
    } catch (err) {
        console.error("Error al conectar:", err);
    }
})();

// --------------------------------
// RUTA PRINCIPAL
// --------------------------------

app.get('/', (req, res) => {
    res.send('Servidor funcionando');
});

// --------------------------------
// USUARIOS
// --------------------------------

app.get('/usuarios', async (req, res) => {
    try {

        const [rows] = await db.query('SELECT * FROM usuario');

        res.json(rows);

    } catch (err) {

        console.error(err);
        res.status(500).send(err.message);

    }
});

// --------------------------------
// REGISTRO
// --------------------------------

app.post('/registro', async (req, res) => {

    try {

        const {
            nombre,
            num_documento_identidad,
            correo,
            contraseña,
            ciudad,
            experiencia
        } = req.body;

        await db.execute(
            `INSERT INTO usuario
            (nombre,num_documento_identidad,correo,contraseña,ciudad,experiencia)
            VALUES (?,?,?,?,?,?)`,
            [
                nombre,
                num_documento_identidad,
                correo,
                contraseña,
                ciudad,
                experiencia
            ]
        );

        res.send("Usuario registrado correctamente");

    } catch (err) {

        console.error(err);
        res.status(500).send(err.message);

    }

});

// --------------------------------
// LOGIN
// --------------------------------

app.post('/login', async (req, res) => {

    try {

        const { correo, contraseña } = req.body;

        const [rows] = await db.execute(
            `SELECT * FROM usuario
            WHERE correo=? AND contraseña=?`,
            [correo, contraseña]
        );

        if (rows.length > 0) {

            res.json({
                success: true,
                mensaje: "Login correcto",
                usuario: rows[0]
            });

        } else {

            res.status(401).json({
                success: false,
                mensaje: "Correo o contraseña incorrectos"
            });

        }

    } catch (err) {

        console.error(err);
        res.status(500).send(err.message);

    }

});

// --------------------------------
// OFERTAS
// --------------------------------

app.get('/ofertas', async (req, res) => {

    try {

        const [rows] = await db.query("SELECT * FROM oferta");

        res.json(rows);

    } catch (err) {

        console.error(err);
        res.status(500).send(err.message);

    }

});

// --------------------------------
// POSTULARSE
// --------------------------------

app.post('/postularme', async (req, res) => {

    try {

        const { id_usuario, id_oferta } = req.body;

        await db.execute(
            `INSERT INTO postulacion
            (id_usuario,id_oferta,fecha_postulacion,estado)
            VALUES (?, ?, NOW(), ?)`,
            [
                id_usuario,
                id_oferta,
                "Pendiente"
            ]
        );

        res.json({
            success: true,
            mensaje: "Postulación realizada correctamente"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            mensaje: "Error al registrar la postulación"
        });

    }

});

// --------------------------------
// CREAR OFERTA
// --------------------------------

app.post('/crear-oferta', async (req, res) => {

    try {

        const {
            id_empresa,
            titulo,
            descripcion,
            salario,
            ubicacion
        } = req.body;

        await db.execute(
            `INSERT INTO oferta
            (id_empresa,titulo,descripcion,salario,ubicacion,fecha_publicacion)
            VALUES (?, ?, ?, ?, ?, NOW())`,
            [
                id_empresa,
                titulo,
                descripcion,
                salario,
                ubicacion
            ]
        );

        res.json({
            success: true,
            mensaje: "Oferta publicada correctamente"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            mensaje: err.message
        });

    }

});

// --------------------------------

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});