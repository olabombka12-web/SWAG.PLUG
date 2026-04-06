const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

// Bezpośrednia ścieżka do skryptu (rozwiązuje błąd 404)
app.get('/script.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'script.js'));
});

app.post('/save-shipping', (req, res) => {
  const order = req.body;
  order.server_date = new Date().toISOString();
  const filePath = path.join(__dirname, 'orders.json');

  // Funkcja zapisu danych
  const saveOrders = (ordersList) => {
    fs.writeFile(filePath, JSON.stringify(ordersList, null, 2), (writeErr) => {
      if (writeErr) return res.status(500).json({ status: 'error' });
      res.json({ status: 'OK' });
    });
  };

  // Sprawdzamy czy plik istnieje, jeśli nie - tworzymy pustą listę
  if (!fs.existsSync(filePath)) {
    saveOrders([order]);
  } else {
    fs.readFile(filePath, 'utf8', (err, data) => {
      let orders = [];
      if (!err && data) {
        try { orders = JSON.parse(data); } catch (e) { orders = []; }
      }
      orders.push(order);
      saveOrders(orders);
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 SWAG.PLUG ONLINE | Port: ${PORT}`);
});

