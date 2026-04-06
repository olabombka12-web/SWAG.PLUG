const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname)); // Serwuje index.html, style.css, script.js automatycznie

// Ścieżka do pliku z zamówieniami
const ORDERS_FILE = path.join(__dirname, 'orders.json');

app.post('/save-order', (req, res) => {
    const newOrder = req.body;
    
    // Dodajemy datę serwera
    newOrder.createdAt = new Date().toISOString();

    // Odczytujemy istniejące zamówienia
    fs.readFile(ORDERS_FILE, 'utf8', (err, data) => {
        let orders = [];
        if (!err && data) {
            try {
                orders = JSON.parse(data);
            } catch (e) {
                orders = [];
            }
        }

        orders.push(newOrder);

        // Zapisujemy zaktualizowaną listę
        fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), (writeErr) => {
            if (writeErr) {
                console.error("Błąd zapisu pliku:", writeErr);
                return res.status(500).json({ success: false, message: "Błąd serwera przy zapisie" });
            }
            console.log("✅ Nowe zamówienie zapisane!");
            res.json({ success: true, message: "Zamówienie przyjęte!" });
        });
    });
});

app.listen(PORT, () => {
    console.log(`🚀 SWAG.PLUG działa na porcie ${PORT}`);
});

