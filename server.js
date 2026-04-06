const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // <--- TUTAJ POPRAWIŁEM BŁĄD (było ://gmail.com)
    port: 465, 
    secure: true, 
    auth: {
        user: 'olabomba12@gmail.com',
        pass: 'rqijphovdgxhlczi' 
    }
});

app.post('/save-shipping', (req, res) => {
    const order = req.body;

    if (!order.items || !order.customer) {
        return res.status(400).json({ status: 'error', message: 'Brak danych zamówienia' });
    }

    const produktyLista = order.items.map(i => 
        `- ${i.name} (${i.size}) x${i.quantity} = ${(i.price * i.quantity).toFixed(2)} zł`
    ).join('\n');

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

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("BŁĄD WYSYŁKI:", error);
            return res.status(500).json({ status: 'error', message: error.message });
        }
        console.log('✅ E-mail wysłany pomyślnie: ' + info.response);
        res.json({ status: 'OK' });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 SWAG.PLUG ONLINE | Port: ${PORT}`);
});
