document.addEventListener('DOMContentLoaded', () => {
  // INICJALIZACJA KOSZYKA
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  updateCartCount();

  // DODAWANIE PRODUKTÓW DO KOSZYKA
  document.querySelectorAll('.cart-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const product = btn.closest('.product');
      if (!product) return;

      const name = product.querySelector('h2').innerText;
      const priceText = product.querySelector('.price').innerText;
      const price = parseFloat(priceText.replace(' zł', '').replace(',', '.'));
      const quantity = parseInt(product.querySelector('input[type="number"]').value) || 1;
      const size = product.querySelector('select').value;

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

  function updateCartCount() {
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) cartCountEl.innerText = count;
  }

  // --- FUNKCJE PRZYPISANE DO WINDOW (ABY DZIAŁAŁY Z ONCLICK W HTML) ---

  window.openSizeInfo = function(imageSrc) {
    const img = document.getElementById("sizeImage");
    if (img) img.src = imageSrc;
    document.getElementById("sizeModal").style.display = "flex";
  };

  window.closeSizeInfo = function(event) {
    if (!event || event.target.id === "sizeModal" || event.target.classList.contains("close")) {
      document.getElementById("sizeModal").style.display = "none";
    }
  };

  window.showCart = function() {
    const modal = document.getElementById('cartModal');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    modal.style.display = 'flex';
    cartItems.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
      cartItems.innerHTML = '<p>Koszyk jest pusty.</p>';
    } else {
      cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        cartItems.innerHTML += `
          <div class="cart-item" style="border-bottom: 1px solid #333; padding: 10px 0; color: #fff;">
            <strong>${item.name}</strong> (${item.size})<br>
            ${item.quantity} x ${item.price} zł = <b>${subtotal} zł</b>
            <button onclick="removeFromCart(${index})" style="color:red; background:none; border:none; cursor:pointer; margin-left:10px;">[USUŃ]</button>
          </div>`;
      });
    }
    if (cartTotal) cartTotal.innerText = total;
  };

  window.removeFromCart = function(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    window.showCart();
  };

  window.closeCart = function(e) {
    if (e.target.id === 'cartModal' || e.target.classList.contains('close')) {
      document.getElementById('cartModal').style.display = 'none';
    }
  };

  window.checkout = function() {
    if (cart.length === 0) {
      alert("Twój koszyk jest pusty!");
      return;
    }
    window.location.href = 'checkout.html';
  };

  console.log("Skrypt SWAG.PLUG załadowany pomyślnie!");
});

