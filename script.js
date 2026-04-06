document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicjalizacja koszyka z localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const updateCartCount = () => {
        const count = cart.reduce((acc, item) => acc + item.quantity, 0);
        const cartCountEl = document.getElementById('cart-count');
        if (cartCountEl) cartCountEl.innerText = count;
    };

    updateCartCount();

    // 2. Obsługa dodawania do koszyka
    document.querySelectorAll('.cart-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const product = btn.closest('.product');
            const name = product.querySelector('h2').innerText;
            const priceText = product.querySelector('.price').innerText;
            const price = parseFloat(priceText.replace(/[^\d.,]/g, '').replace(',', '.'));
            const size = product.querySelector('select')?.value || 'One Size';
            
            const item = { name, price, size, quantity: 1 };
            
            const existing = cart.find(p => p.name === name && p.size === size);
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push(item);
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            alert(`Dodano do koszyka: ${name} (Rozmiar: ${size})`);
        });
    });

    // 3. Funkcja otwierania koszyka
    window.showCart = function() {
        const modal = document.getElementById('cartModal');
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        
        if (!modal || !cartItems) return;

        modal.style.display = 'flex';
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p style="text-align:center;">Twój koszyk jest pusty.</p>';
            if (cartTotal) cartTotal.innerText = '0.00';
            return;
        }

        let total = 0;
        cart.forEach((item) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            cartItems.innerHTML += `
                <div style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid #333; padding-bottom: 5px;">
                    <span><strong>${item.name}</strong><br><small>Rozmiar: ${item.size} x${item.quantity}</small></span>
                    <span>${itemTotal.toFixed(2)} zł</span>
                </div>`;
        });
        
        if (cartTotal) cartTotal.innerText = total.toFixed(2);
    };

    // 4. Funkcja zamykania koszyka
    window.closeCart = function(event) {
        const modal = document.getElementById('cartModal');
        if (event === undefined || event.target === modal || (event.target && event.target.className === 'close')) {
            if (modal) modal.style.display = 'none';
        }
    };

    // 5. PRZEJŚCIE DO FORMULARZA
    window.checkout = function() {
        if (cart.length === 0) {
            alert("Twój koszyk jest pusty!");
            return;
        }
        window.location.href = "checkout.html";
    };

    // 6. Obsługa info o rozmiarach
    window.openSizeInfo = function(imgSrc) {
        const modal = document.getElementById('sizeModal');
        const img = document.getElementById('sizeImage');
        if (modal && img) {
            img.src = imgSrc;
            modal.style.display = 'flex';
        }
    };

    window.closeSizeInfo = function(event) {
        const modal = document.getElementById('sizeModal');
        if (event.target === modal || (event.target && event.target.className === 'close')) {
            if (modal) modal.style.display = 'none';
        }
    };
});
