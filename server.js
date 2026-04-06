const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// KLUCZOWA ZMIANA: Port musi być dynamiczny dla hostingu (np. Render/Railway)
const PORT = process.env.PORT || 3000;

// Middleware do obsługi JSON i serwowania plików (html, css, js)
app.use(express.json());
// Precyzyjne serwowanie plików z folderu głównego
app.use(express.static(path.join(__dirname, '.')));

// Dodatkowy "bezpiecznik" - bezpośrednia ścieżka do skryptu
app.get('/script.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'script.js'));
});


app.post('/save-shipping', (req, res) => {
  const order = req.body;
  
  // Zawsze dodajemy datę po stronie serwera dla pewności
  order.server_date = new Date().toISOString();

  const filePath = path.join(__dirname, 'orders.json');

  // 1. Czytamy plik (jeśli nie istnieje, zaczynamy od pustej tablicy)
  fs.readFile(filePath, 'utf8', (err, data) => {
    let orders = [];

    if (!err && data) {
      try {
        orders = JSON.parse(data);
      } catch (parseErr) {
        console.error("⚠️ Błąd danych w orders.json, resetuję listę.");
        orders = [];
      }
    }

    // 2. Dodajemy nowe zamówienie
    orders.push(order);

    // 3. Zapisujemy zaktualizowaną listę
    fs.writeFile(filePath, JSON.stringify(orders, null, 2), (writeErr) => {
      if (writeErr) {
        console.error("❌ Błąd zapisu pliku:", writeErr);
        return res.status(500).json({ status: 'error', message: 'Serwer nie mógł zapisać danych' });
      }
      
      console.log("✅ Nowe zamówienie od zapisane w orders.json!");
      res.json({ status: 'OK' });
    });
  });
});

// Start serwera
app.listen(PORT, () => {
  console.log(`🚀 SWAG.PLUG ONLINE | Port: ${PORT}`);
});
