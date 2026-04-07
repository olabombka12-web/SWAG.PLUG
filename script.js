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

    let total = 0;
    cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        cartItems.innerHTML += `
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #222; padding:10px 0; font-size:13px;">
                <div style="flex:1;">
                    <b style="color:#fff;">${item.name}</b><br>
                    <small style="color:#666;">Size: ${item.size} | Qty: ${item.quantity}</small>
                </div>
                <div style="text-align:right;">
                    <span style="color:#fff;">${subtotal.toFixed(2)} PLN</span><br>
                    <button onclick="removeFromCart(${index})" style="background:none; color:red; border:none; cursor:pointer; font-size:10px; padding:0;">[ REMOVE ]</button>
                </div>
            </div>`;
    });
    
    if (cartTotal) cartTotal.innerText = total.toFixed(2);
};

// Funkcja usuwania z koszyka
window.removeFromCart = function(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    showCart(); // Odśwież widok
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

// Funkcja aktualizacji licznika na ikonce
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) cartCountEl.innerText = count;
}

// 2. LOGIKA DODAWANIA DO KOSZYKA
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    document.querySelectorAll('.cart-btn').forEach(btn => {
        btn.onclick = () => {
            const product = btn.closest('.product');
            const name = product.querySelector('h2').innerText;
            const priceText = product.querySelector('.price').innerText;
            const price = parseFloat(priceText.replace(/[^\d.,]/g, '').replace(',', '.'));
            
            // POBIERANIE ROZMIARU I ILOŚCI Z INPUTÓW
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
            
            // Efekt wizualny zamiast zwykłego alertu (opcjonalnie)
            btn.innerText = "ADDED! / DODANO!";
            setTimeout(() => { btn.innerText = "ADD TO CART / DODAJ DO KOSZYKA"; }, 1500);
        };
    });
});

