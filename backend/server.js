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
            ciudad,
            experiencia
        } = req.body;

        await sql.query`
            INSERT INTO usuario
            (nombre, num_documento_identidad, correo, ciudad, experiencia)
            VALUES
            (${nombre}, ${num_documento_identidad}, ${correo}, ${ciudad}, ${experiencia})
        `;

        res.send('Usuario registrado correctamente');
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});
app.get('/prueba-registro', async (req, res) => {
    await sql.query`
        INSERT INTO usuario
        (nombre, num_documento_identidad, correo, ciudad, experiencia)
        VALUES
        ('Prueba Usuario', 123456, 'prueba@test.com', 'Zipaquirá', 'Sin experiencia')
    `;

    res.send('Registro insertado');
});
app.listen(3000, () => {
    console.log('Servidor corriendo en puerto 3000');
});