const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(bodyParser.json());

// Servir archivos estáticos (HTML, CSS, JS de las carpetas principales)
// __dirname apunta a la carpeta 'api', así que subimos un nivel para llegar a la raíz del proyecto
const projectRoot = path.join(__dirname, '..');
app.use(express.static(projectRoot));

// Función para hashear un string con SHA-256 (igual que en el admin.html original)
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Endpoint para el login
app.post('/api/login', async (req, res) => {
    const { password } = req.body;

    // Obtener el hash seguro desde las variables de entorno de Render
    const PASSWORD_HASH = process.env.PASSWORD_HASH;

    if (!PASSWORD_HASH) {
        // Mensaje de error si el administrador no ha configurado la variable de entorno en Render
        return res.status(500).json({ success: false, message: 'Error del servidor: La variable de entorno PASSWORD_HASH no está configurada.' });
    }

    if (!password) {
        return res.status(400).json({ success: false, message: 'La contraseña no puede estar vacía.' });
    }

    try {
        const inputHash = await sha256(password);

        if (inputHash === PASSWORD_HASH) {
            // La contraseña es correcta
            res.json({ success: true });
        } else {
            // La contraseña es incorrecta
            res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
        }
    } catch (error) {
        console.error('Error al hashear la contraseña:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor al procesar la contraseña.' });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});
