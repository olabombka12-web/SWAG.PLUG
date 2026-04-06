// 1. FUNKCJE GLOBALNE (Widoczne dla przycisków w HTML)

window.showCart = function() {
    const modal = document.getElementById('cartModal');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (!modal || !cartItems) {
        console.error("Błąd: Nie znaleziono modala koszyka w HTML!");
        return;
    }

    modal.style.display = 'flex';
    cartItems.innerHTML = cart.length === 0 ? '<p style="text-align:center;">Koszyk jest pusty</p>' : '';
    
    let total = 0;
    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        cartItems.innerHTML += `
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid #333; padding:10px 0;">
                <span>${item.name} (${item.size}) x${item.quantity}</span>
                <span>${subtotal.toFixed(2)} zł</span>
            </div>`;
    });
    if (cartTotal) cartTotal.innerText = total.toFixed(2);
};

window.checkout = function() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert("Koszyk jest pusty!");
        return;
    }
    // Przekierowanie do formularza
    window.location.href = "checkout.html"; 
};

window.closeCart = function(e) { 
    const modal = document.getElementById('cartModal');
    if(e.target === modal || e.target.className === 'close') {
        modal.style.display = 'none';
    }
};

// 2. LOGIKA ŁADOWANIA STRONY (Dodawanie do koszyka)

document.addEventListener('DOMContentLoaded', () => {
    // Funkcja aktualizacji licznika na ikonie koszyka
    const updateCartCount = () => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const count = cart.reduce((acc, item) => acc + item.quantity, 0);
        const cartCountEl = document.getElementById('cart-count');
        if (cartCountEl) cartCountEl.innerText = count;
    };

    updateCartCount();

    // Obsługa przycisków "DODAJ DO KOSZYKA"
    document.querySelectorAll('.cart-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const product = btn.closest('.product');
            const name = product.querySelector('h2').innerText;
            const priceText = product.querySelector('.price').innerText;
            const price = parseFloat(priceText.replace(/[^\d.,]/g, '').replace(',', '.'));
            const size = product.querySelector('select')?.value || 'One Size';
            
            let currentCart = JSON.parse(localStorage.getItem('cart')) || [];
            const existing = currentCart.find(p => p.name === name && p.size === size);
            
            if (existing) {
                existing.quantity += 1;
            } else {
                currentCart.push({ name, price, size, quantity: 1 });
            }

            localStorage.setItem('cart', JSON.stringify(currentCart));
            updateCartCount();
            alert(`Dodano do koszyka: ${name}`);
        });
    });
});
