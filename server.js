// server.js - VERSIÓN FINAL CLOUD (RENDER READY)
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
const app = express();

// 1. Middlewares necesarios
app.use(cors());
app.use(express.json());

// 2. IMPORTANTE PARA RENDER: Servir los archivos del Frontend (HTML, CSS, JS)
app.use(express.static(__dirname));

// 3. Ruta principal para asegurar que cargue el index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// --- CONFIGURACIÓN DEL CORREO (SEGURA) ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Render llenará esto automáticamente
        pass: process.env.EMAIL_PASS  // Render llenará esto automáticamente
    }
});

// --- RUTA DE API PARA EL CHECKOUT ---
app.post('/api/checkout', async (req, res) => {
    const { customer, items, total } = req.body;

    console.log(`Procesando pedido de: ${customer.name} (${customer.email})`);
    
    // Generar lista de productos
    const itemsHtml = items.map(i => 
        `<li style="margin-bottom: 5px;">${i.name} - <strong>S/ ${i.price}</strong></li>`
    ).join('');
    
    // Configuración WhatsApp
    const numeroWhatsApp = "51999999999"; // <--- CAMBIA ESTO POR TU NÚMERO REAL
    const mensajeWsp = `Hola Golden Chicken, ya realicé el Yape de mi pedido por S/ ${total}. Adjunto la constancia.`;
    const linkWsp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensajeWsp)}`;

    // ---------------------------------------------------------
    // 1. DISEÑO PARA EL CLIENTE (Con QR Yape + Botón WhatsApp)
    // ---------------------------------------------------------
    const htmlCliente = `
        <div style="font-family: 'Helvetica', sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
            <div style="background-color: #D4AF37; padding: 20px; text-align: center;">
                <h1 style="margin: 0; color: #000;">GOLDEN CHICKEN</h1>
                <p style="margin: 5px 0 0; color: #333;">Confirma tu Pedido</p>
            </div>
            <div style="padding: 20px;">
                <p>Hola <strong>${customer.name}</strong>,</p>
                <p>Tu pedido ha sido registrado. Para que cocina empiece a prepararlo, por favor completa el pago:</p>
                
                <div style="text-align: center; background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #742284; margin-top: 0;">1. Escanea el QR</h3>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" 
                         alt="QR Yape" style="width: 150px; height: 150px; border: 2px solid #742284; padding: 5px; background: white;">
                    <p style="font-size: 1.4rem; font-weight: bold; margin: 10px 0;">Total: S/ ${total}</p>

                    <hr style="border: 0; border-top: 1px dashed #ccc; margin: 20px 0;">

                    <h3 style="color: #25D366; margin-top: 0;">2. Envía la Constancia</h3>
                    <p style="font-size: 0.9rem; color: #555;">Dale clic para enviarnos la captura:</p>
                    
                    <a href="${linkWsp}" 
                       style="background-color: #25D366; color: white; padding: 15px 25px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 1.1rem; display: inline-block;">
                       <span style="font-size: 1.2rem;">📱</span> Enviar Constancia por WhatsApp
                    </a>
                </div>

                <h3>Tu Pedido:</h3>
                <ul style="color: #555;">${itemsHtml}</ul>
            </div>
        </div>
    `;

    // ---------------------------------------------------------
    // 2. DISEÑO PARA LA POLLERÍA (Solo Texto/Orden)
    // ---------------------------------------------------------
    const htmlRestaurante = `
        <div style="font-family: 'Courier New', monospace; padding: 20px; border: 2px dashed #000; max-width: 500px;">
            <h2 style="text-align: center; margin-top: 0;">NUEVA ORDEN DE PEDIDO 🔔</h2>
            <p><strong>Cliente:</strong> ${customer.name}</p>
            <p><strong>Email:</strong> ${customer.email}</p>
            <p><strong>Dirección:</strong> ${customer.address}</p>
            <p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p>
            <hr>
            <h3>DETALLE COCINA:</h3>
            <ul>${itemsHtml}</ul>
            <hr>
            <h3 style="text-align: right;">TOTAL A COBRAR: S/ ${total}</h3>
            <p style="text-align: center; color: red;">* Esperar confirmación de pago del cliente</p>
        </div>
    `;

    try {
        // Enviar al Cliente
        await transporter.sendMail({
            from: 'Golden Chicken Pedidos <abernedo14@gmail.com>',
            to: customer.email,
            subject: `🍗 Paga tu pedido aquí - S/ ${total}`,
            html: htmlCliente
        });

        // Enviar a la Pollería
        await transporter.sendMail({
            from: 'Sistema Web <abernedo14@gmail.com>',
            to: 'abernedo14@gmail.com', 
            subject: `🔔 NUEVO PEDIDO - ${customer.name} - S/ ${total}`,
            html: htmlRestaurante
        });

        console.log("Correos enviados correctamente");
        res.json({ success: true, message: 'Pedido procesado.' });

    } catch (error) {
        console.error("Error al enviar correos:", error);
        res.status(500).json({ success: false, message: 'Error en el servidor de correos' });
    }
});

// 4. IMPORTANTE: Usar el puerto que asigne Render (process.env.PORT) o 3000 si es local
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);

});
