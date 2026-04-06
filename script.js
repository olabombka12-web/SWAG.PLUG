// Funkcje modala z tabelą rozmiarów
function openSizeInfo(imageSrc) {
  const img = document.getElementById("sizeImage");
  if (img) img.src = imageSrc;
  document.getElementById("sizeModal").style.display = "flex";
}

function closeSizeInfo(event) {
  if (!event || event.target.id === "sizeModal" || event.target.classList.contains("close")) {
    document.getElementById("sizeModal").style.display = "none";
  }
}

// INICJALIZACJA KOSZYKA
let cart = JSON.parse(localStorage.getItem('cart')) || [];
updateCartCount();

// DODAWANIE PRODUKTÓW DO KOSZYKA
document.querySelectorAll('.cart-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const product = btn.closest('.product');
    
    const name = product.querySelector('h2').innerText;
    const price = parseFloat(product.querySelector('.price').innerText.replace(' zł', ''));
    const quantity = parseInt(product.querySelector('input[type="number"]').value);
    
    // POBIERANIE ROZMIARU (Tego brakowało!)
    const size = product.querySelector('select').value;

    addToCart({ name, price, quantity, size });
  });
});

function addToCart(item) {
  // Sprawdzamy czy w koszyku jest już ten sam produkt O TYM SAMYM ROZMIARZE
  const existing = cart.find(p => p.name === item.name && p.size === item.size);

  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push(item);
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  alert(`Dodano do koszyka: ${item.name} (Rozmiar: ${item.size})`);
}

function updateCartCount() {
  const count = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartCountEl = document.getElementById('cart-count');
  if (cartCountEl) cartCountEl.innerText = count;
}

// WYŚWIETLANIE KOSZYKA W MODALU
function showCart() {
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
        <div class="cart-item" style="border-bottom: 1px solid #eee; padding: 5px 0;">
          <strong>${item.name}</strong> (${item.size})<br>
          ${item.quantity} x ${item.price} zł = <b>${subtotal} zł</b>
          <button onclick="removeFromCart(${index})" style="color:red; cursor:pointer; margin-left:10px;">Usuń</button>
        </div>`;
    });
  }
  
  if (cartTotal) cartTotal.innerText = total;
}

// USUWANIE Z KOSZYKA
function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  showCart(); // Odśwież widok modala
}

function closeCart(e) {
  if (e.target.id === 'cartModal' || e.target.classList.contains('close')) {
    document.getElementById('cartModal').style.display = 'none';
  }
}

// PRZEJŚCIE DO KASY
function checkout() {
  if (cart.length === 0) {
    alert("Twój koszyk jest pusty!");
    return;
  }
  window.location.href = 'checkout.html';
}
