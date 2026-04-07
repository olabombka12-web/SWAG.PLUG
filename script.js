// --- KONFIGURACJA WALUTY (Musi być taka sama jak w checkout.html) ---
const rates = { "PLN": 1, "USD": 0.25, "EUR": 0.23 };
let currentCurrency = localStorage.getItem('userCurrency') || 'PLN';

window.changeCurrency = function(val) {
    localStorage.setItem('userCurrency', val);
    location.reload(); // Przeładowanie strony aktualizuje ceny
};

// 1. FUNKCJE GLOBALNE
window.showCart = function() {
    const modal = document.getElementById('cartModal');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (!modal || !cartItems) return;

    modal.style.display = 'flex';
    cartItems.innerHTML = "";
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align:center; color:#888;">Your cart is empty / Koszyk jest pusty</p>';
    }

    let totalPLN = 0;
    cart.forEach((item, index) => {
        const itemSubtotalPLN = item.price * item.quantity;
        totalPLN += itemSubtotalPLN;

        // Przeliczanie ceny na wybraną walutę do wyświetlenia
        const displaySubtotal = (itemSubtotalPLN * rates[currentCurrency]).toFixed(2);

        cartItems.innerHTML += `
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #222; padding:10px 0; font-size:13px;">
                <div style="flex:1;">
                    <b style="color:#fff;">${item.name}</b><br>
                    <small style="color:#666;">Size: ${item.size} | Qty: ${item.quantity}</small>
                </div>
                <div style="text-align:right;">
                    <span style="color:#fff;">${displaySubtotal} ${currentCurrency}</span><br>
                    <button onclick="removeFromCart(${index})" style="background:none; color:red; border:none; cursor:pointer; font-size:10px; padding:0;">[ REMOVE ]</button>
                </div>
            </div>`;
    });
    
    // Przeliczanie sumy końcowej
    if (cartTotal) {
        cartTotal.innerText = (totalPLN * rates[currentCurrency]).toFixed(2) + " " + currentCurrency;
    }
};

window.removeFromCart = function(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    showCart();
    updateCartCount();
};

window.goToCheckout = function() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) return alert("Cart is empty!");
    window.location.href = "checkout.html"; 
};

window.closeCart = function(e) { 
    const modal = document.getElementById('cartModal');
    if(e.target === modal || e.target.className === 'close') {
        modal.style.display = 'none';
    }
};

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) cartCountEl.innerText = count;
}

// 2. LOGIKA DODAWANIA DO KOSZYKA I CENY NA STRONIE
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    // Ustawienie poprawnej waluty w select jeśli istnieje
    const select = document.getElementById('currencySelect');
    if(select) select.value = currentCurrency;

    // Przeliczenie cen produktów na stronie głównej przy starcie
    document.querySelectorAll('.price').forEach(el => {
        const basePrice = parseFloat(el.innerText);
        if(!isNaN(basePrice)) {
            const converted = (basePrice * rates[currentCurrency]).toFixed(2);
            el.innerText = `${converted} ${currentCurrency}`;
        }
    });

    document.querySelectorAll('.cart-btn').forEach(btn => {
        btn.onclick = () => {
            const product = btn.closest('.product');
            const name = product.querySelector('h2').innerText;
            
            // Pobieramy zawsze bazową cenę w PLN (zakładamy, że w HTML masz liczbę bez waluty lub parsowaną poprawnie)
            // Jeśli w HTML masz "89.00 PLN", ten regex wyciągnie 89.00
            const priceText = product.querySelector('.price').dataset.basePrice || product.querySelector('.price').innerText;
            const price = parseFloat(priceText.replace(/[^\d.,]/g, '').replace(',', '.'));
            
            const size = product.querySelector('select')?.value || 'One Size';
            const qtyInput = product.querySelector('input[type="number"]');
            const qty = qtyInput ? parseInt(qtyInput.value) : 1;
            
            let currentCart = JSON.parse(localStorage.getItem('cart')) || [];
            const existing = currentCart.find(p => p.name === name && p.size === size);
            
            if (existing) {
                existing.quantity += qty;
            } else {
                currentCart.push({ name, price, size, quantity: qty });
            }

            localStorage.setItem('cart', JSON.stringify(currentCart));
            updateCartCount();
            
            btn.innerText = "ADDED! / DODANO!";
            setTimeout(() => { btn.innerText = "ADD TO CART / DODAJ DO KOSZYKA"; }, 1500);
        };
    });
});
