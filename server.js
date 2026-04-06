const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

const ORDERS_FILE = path.join(__dirname, 'orders.json');

// Endpoint do zapisu zamówienia
app.post('/save-shipping', (req, res) => {
    const order = req.body;
    order.server_date = new Date().toISOString();

    fs.readFile(ORDERS_FILE, 'utf8', (err, data) => {
        let orders = [];
        if (!err && data) {
            try { orders = JSON.parse(data); } catch (e) { orders = []; }
        }
        orders.push(order);

        fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), (writeErr) => {
            if (writeErr) return res.status(500).json({ status: 'error' });
            res.json({ status: 'OK' });
        });
    });
});

app.listen(PORT, () => {
    console.log(`🚀 SWAG.PLUG ONLINE | Port: ${PORT}`);
});
