// server.js - VERSIÓN FINAL (PUERTO 587 - ANTI ERROR DE CONEXIÓN)
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); 

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// --- CONFIGURACIÓN PUERTO 587 (LA MÁS COMPATIBLE) ---
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Para puerto 587 esto debe ser FALSE
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false // Ayuda a que la conexión no se corte en Render
    }
});

app.post('/api/checkout', async (req, res) => {
    const { customer, items, total } = req.body;
    console.log(`🔔 Procesando pedido Cloud de: ${customer.name}`);

    const itemsHtml = items.map(i => `<li>${i.name} - S/ ${i.price}</li>`).join('');
    
    const numeroWhatsApp = "51999999999"; 
    const linkWsp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(`Hola, envío constancia por S/ ${total}`)}`;

    const htmlCliente = `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; max-width: 600px;">
            <h2 style="color: #D4AF37; text-align: center;">GOLDEN CHICKEN</h2>
            <p>Hola <strong>${customer.name}</strong>, tu pedido está registrado.</p>
            <div style="background: #f9f9f9; padding: 20px; text-align: center; margin: 20px 0;">
                <h3>Total a Pagar: S/ ${total}</h3>
                <p>Escanea el QR o yapea al número 999-999-999</p>
                <img src="cid:yapeqr" width="150" style="border: 2px solid #D4AF37; padding: 5px; background: white;"/>
                <br><br>
                <a href="${linkWsp}" style="background: #25D366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Enviar Constancia por WhatsApp</a>
            </div>
            <h3>Tu Pedido:</h3>
            <ul>${itemsHtml}</ul>
        </div>
    `;

    const htmlDueño = `
        <div style="font-family: 'Courier New', monospace; padding: 20px; border: 2px dashed red; max-width: 500px;">
            <h2 style="text-align: center;">🔔 NUEVA ORDEN WEB</h2>
            <p><strong>Cliente:</strong> ${customer.name}</p>
            <p><strong>Email:</strong> ${customer.email}</p>
            <p><strong>Dirección:</strong> ${customer.address}</p>
            <hr>
            <h3>DETALLE:</h3>
            <ul>${itemsHtml}</ul>
            <hr>
            <h3 style="text-align: right;">TOTAL: S/ ${total}</h3>
        </div>
    `;

    try {
        await transporter.sendMail({
            from: 'Golden Chicken <abernedo14@gmail.com>',
            to: customer.email,
            subject: `🍗 Confirma tu Pedido - S/ ${total}`,
            html: htmlCliente,
            attachments: [{
                filename: 'yapeqr.jpg',       
                path: __dirname + '/yapeqr.jpg',
                cid: 'yapeqr'
            }]
        });

        await transporter.sendMail({
            from: 'Sistema Web <abernedo14@gmail.com>',
            to: process.env.EMAIL_USER, 
            subject: `🔔 PEDIDO NUEVO - ${customer.name} - S/ ${total}`,
            html: htmlDueño
        });
        
        console.log("✅ Correos enviados desde Render (Puerto 587)");
        res.json({ success: true });
    } catch (error) {
        console.error("❌ Error Cloud:", error);
        res.status(500).json({ success: false, message: 'Error de conexión con Gmail' });
    }
});

app.listen(PORT, () => {
    console.log(`✅ SERVIDOR CLOUD LISTO en puerto ${PORT}`);
});
