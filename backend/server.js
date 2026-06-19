const express = require('express');
console.log('ESTE ES MI SERVER.JS');
const sql = require('mssql');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const config = {
    server: 'localhost',
    database: 'EmpleateYa',
    user: 'empleateya_user',
    password: 'EmpleateYa123',
    port: 50987,
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

sql.connect(config)
    .then(() => {
        console.log('Conectado a SQL Server');
    })
    .catch(err => {
        console.log('Error de conexión:', err);
    });

app.get('/', (req, res) => {
    res.send('Servidor funcionando');
});

app.get('/usuarios', async (req, res) => {
    try {
        const result = await sql.query('SELECT * FROM usuario');
        res.json(result.recordset);
    } catch (err) {
        console.error('ERROR SQL:', err);
        res.status(500).send(err.message);
    }
});
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

        await sql.query`
            INSERT INTO usuario
            (nombre, num_documento_identidad, correo, contraseña, ciudad, experiencia)
            VALUES
            (${nombre}, ${num_documento_identidad}, ${correo}, ${contraseña}, ${ciudad}, ${experiencia})
        `;

        res.send('Usuario registrado correctamente');

    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});
app.post('/login', async (req, res) => {
    try {

        const { correo, contraseña } = req.body;

        const result = await sql.query`
            SELECT *
            FROM usuario
            WHERE correo = ${correo}
            AND contraseña = ${contraseña}
        `;

        if (result.recordset.length > 0) {

            res.json({
                success: true,
                mensaje: 'Login correcto',
                usuario: result.recordset[0]
            });

        } else {

            res.status(401).json({
                success: false,
                mensaje: 'Correo o contraseña incorrectos'
            });

        }

    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

app.get('/ofertas', async (req, res) => {

    try {

        const result = await sql.query('SELECT * FROM oferta');

        res.json(result.recordset);

    } catch (err) {

        console.error(err);
        res.status(500).send(err.message);

    }

});

app.post('/postular', async (req, res) => {

    try {

        const {
            id_usuario,
            id_oferta
        } = req.body;

        await sql.query`
            INSERT INTO postulacion
            (id_usuario, id_oferta, estado)
            VALUES
            (${id_usuario}, ${id_oferta}, 'Pendiente')
        `;

        res.send('Postulación realizada');

    } catch (err) {

        console.error(err);
        res.status(500).send(err.message);

    }

});

app.post('/postular', async (req, res) => {

    try {

        const {
            id_usuario,
            id_oferta
        } = req.body;

        await sql.query`
            INSERT INTO postulacion
            (id_usuario, id_oferta, estado)
            VALUES
            (${id_usuario}, ${id_oferta}, 'Pendiente')
        `;

        res.send('Postulación realizada');

    } catch (err) {

        console.error(err);
        res.status(500).send(err.message);

    }

});

app.post('/postularme', async (req, res) => {

    try {

        const { id_usuario, id_oferta } = req.body;

        await sql.query`
            INSERT INTO postulacion
            (id_usuario, id_oferta, fecha_postulacion, estado)
            VALUES
            (
                ${id_usuario},
                ${id_oferta},
                GETDATE(),
                'Pendiente'
            )
        `;

        res.json({
            success: true,
            mensaje: 'Postulación realizada correctamente'
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            mensaje: 'Error al registrar la postulación'
        });

    }
});

app.listen(3000, () => {
    console.log('Servidor corriendo en puerto 3000');
});