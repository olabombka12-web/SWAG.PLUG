const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const app = express();

// Obsługa danych JSON i serwowanie plików statycznych (HTML, CSS, JS)
app.use(express.json());
app.use(express.static(__dirname));

// KONFIGURACJA GMAIL (Port 465 + SSL to najpewniejsza opcja na Render)
const transporter = nodemailer.createTransport({
    host: '://gmail.com',
    port: 465, 
    secure: true, // true dla portu 465
    auth: {
        user: 'olabomba12@gmail.com',
        pass: 'rqijphovdgxhlczi' // Twoje 16-znakowe Hasło Aplikacji
    }
});

// Ścieżka obsługująca wysyłkę zamówienia
app.post('/save-shipping', (req, res) => {
    const order = req.body;

    // Sprawdzenie czy dane dotarły
    if (!order.items || !order.customer) {
        return res.status(400).json({ status: 'error', message: 'Brak danych zamówienia' });
    }

    // Tworzenie listy produktów do maila
    const produktyLista = order.items.map(i => 
        `- ${i.name} (${i.size || 'One Size'}) x${i.quantity} = ${(i.price * i.quantity).toFixed(2)} zł`
    ).join('\n');

    // Treść wiadomości e-mail
    const mailOptions = {
        from: '"SWAG.PLUG Store" <olabomba12@gmail.com>',
        to: 'olabomba12@gmail.com',
        subject: `🔥 NOWE ZAMÓWIENIE - ${order.customer.name}`,
        text: `Masz nowe zamówienie w SWAG.PLUG!\n\n` +
              `--- DANE KLIENTA ---\n` +
              `Imię i Nazwisko: ${order.customer.name}\n` +
              `Adres: ${order.customer.addr}, ${order.customer.city}\n` +
              `Telefon: ${order.customer.phone}\n\n` +
              `--- ZAMÓWIENIE ---\n` +
              `${produktyLista}\n\n` +
              `ŁĄCZNA KWOTA: ${Number(order.total).toFixed(2)} zł\n` +
              `METODA PŁATNOŚCI: ${order.payment.method}\n` +
              `DATA: ${new Date().toLocaleString('pl-PL')}`
    };

    // Wysyłka maila
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("BŁĄD WYSYŁKI:", error);
            // Jeśli tu wystąpi błąd, w konsoli przeglądarki zobaczysz status 500
            return res.status(500).json({ status: 'error', message: error.message });
        }
        console.log('✅ E-mail wysłany pomyślnie: ' + info.response);
        res.json({ status: 'OK' });
    });
});

// Start serwera na porcie przypisanym przez Render lub 3000 lokalnie
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 SWAG.PLUG ONLINE | Port: ${PORT}`);
});
