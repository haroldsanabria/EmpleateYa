const express = require('express');
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

app.listen(3000, () => {
    console.log('Servidor corriendo en puerto 3000');
});