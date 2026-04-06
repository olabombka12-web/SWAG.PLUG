document.addEventListener('DOMContentLoaded', () => {
  console.log("Skrypt SWAG.PLUG załadowany pomyślnie!");

  // 1. INICJALIZACJA KOSZYKA
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Funkcja pomocnicza do odświeżania licznika na ikonce koszyka
  function updateCartCount() {
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) cartCountEl.innerText = count;
  }

  updateCartCount();

  // 2. OBSŁUGA PRZYCISKÓW "DODAJ DO KOSZYKA"
  document.querySelectorAll('.cart-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const product = btn.closest('.product');
      if (!product) return;

      const name = product.querySelector('h2').innerText;
      const priceText = product.querySelector('.price').innerText;
      // Usuwamy wszystko co nie jest cyfrą lub kropką/przecinkiem
      const price = parseFloat(priceText.replace(/[^\d.,]/g, '').replace(',', '.'));
      const quantityInput = product.querySelector('input[type="number"]');
      const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
      const sizeSelect = product.querySelector('select');
      const size = sizeSelect ? sizeSelect.value : 'One Size';

      addToCart({ name, price, quantity, size });
    });
  });

  function addToCart(item) {
    const existing = cart.find(p => p.name === item.name && p.size === item.size);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      cart.push(item);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`Dodano do koszyka: ${item.name} (${item.size})`);
  }

  // 3. FUNKCJE GLOBALNE (DOSTĘPNE DLA ONCLICK W HTML)
  
  window.openSizeInfo = function(imageSrc) {
    const img = document.getElementById("sizeImage");
    if (img) img.src = imageSrc;
    const modal = document.getElementById("sizeModal");
    if (modal) modal.style.display = "flex";
  };

  window.closeSizeInfo = function(event) {
    const modal = document.getElementById("sizeModal");
    if (!event || event.target.id === "sizeModal" || event.target.classList.contains("close")) {
      if (modal) modal.style.display = "none";
    }
  };

  window.showCart = function() {
    const modal = document.getElementById('cartModal');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!modal || !cartItems) return;

    modal.style.display = 'flex';
    cartItems.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
      cartItems.innerHTML = '<p style="color:#888; text-align:center;">Koszyk jest pusty.</p>';
    } else {
      cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        cartItems.innerHTML += `
          <div class="cart-item" style="border-bottom: 1px solid #333; padding: 10px 0; color: #fff; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <strong>${item.name}</strong> (${item.size})<br>
              ${item.quantity} x ${item.price} zł = <b>${subtotal} zł</b>
            </div>
            <button onclick="window.removeFromCart(${index})" style="color:#ff0000; background:none; border:1px solid #ff0000; padding: 5px; cursor:pointer; font-family:inherit;">USUŃ</button>
          </div>`;
      });
    }
    if (cartTotal) cartTotal.innerText = total;
  };

  window.removeFromCart = function(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    window.showCart(); // Odświeżamy listę w modalu
  };

  window.closeCart = function(e) {
    const modal = document.getElementById('cartModal');
    if (!e || e.target.id === 'cartModal' || e.target.classList.contains('close')) {
      if (modal) modal.style.display = 'none';
    }
  };

  window.checkout = function() {
    if (cart.length === 0) {
      alert("Twój koszyk jest pusty!");
      return;
    }
    window.location.href = 'checkout.html';
  };
});
