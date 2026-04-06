const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

// KONFIGURACJA WYSYŁKI MAILOWEJ
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'olabomba12@gmail.com',
        pass: 'TWOJE_HASLO_APLIKACYJNE_16_ZNAKOW' // <--- TUTAJ WKLEJ KOD Z GOOGLE
    }
});

app.post('/save-shipping', (req, res) => {
    const order = req.body;

    // Tworzenie czytelnej listy produktów do maila
    const produktyLista = order.items.map(i => `- ${i.name} (${i.size}) x${i.quantity} = ${(i.price * i.quantity).toFixed(2)} zł`).join('\n');

    const mailOptions = {
        from: 'SWAG.PLUG <olabomba12@gmail.com>',
        to: 'olabomba12@gmail.com',
        subject: `🔥 NOWE ZAMÓWIENIE - ${order.customer.name}`,
        text: `Masz nowe zamówienie w SWAG.PLUG!\n\n` +
              `--- DANE KLIENTA ---\n` +
              `Imię i Nazwisko: ${order.customer.name}\n` +
              `Adres: ${order.customer.addr}, ${order.customer.city}\n` +
              `Telefon: ${order.customer.phone}\n\n` +
              `--- ZAMÓWIENIE ---\n` +
              `${produktyLista}\n\n` +
              `ŁĄCZNA KWOTA: ${order.total.toFixed(2)} zł\n` +
              `METODA PŁATNOŚCI: ${order.payment.method}\n` +
              `DATA: ${new Date().toLocaleString('pl-PL')}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Błąd wysyłki maila:", error);
            return res.status(500).json({ status: 'error', message: 'Serwer nie mógł wysłać maila' });
        }
        console.log('E-mail wysłany: ' + info.response);
        res.json({ status: 'OK' });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 SWAG.PLUG ONLINE NA PORCIE ${PORT}`));
