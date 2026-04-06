document.addEventListener('DOMContentLoaded', () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const updateCartCount = () => {
        const count = cart.reduce((acc, item) => acc + item.quantity, 0);
        const cartCountEl = document.getElementById('cart-count');
        if (cartCountEl) cartCountEl.innerText = count;
    };

    updateCartCount();

    // Dodawanie do koszyka
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
            alert(`Dodano: ${name}`);
        });
    });

    // Wyświetlanie koszyka
    window.showCart = function() {
        const modal = document.getElementById('cartModal');
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        if (!modal || !cartItems) return;

        modal.style.display = 'flex';
        cartItems.innerHTML = cart.length === 0 ? '<p>Koszyk jest pusty</p>' : '';
        
        let total = 0;
        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            cartItems.innerHTML += `
                <div style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid #333;">
                    <span>${item.name} (${item.size}) x${item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)} zł</span>
                </div>`;
        });
        if (cartTotal) cartTotal.innerText = total.toFixed(2);
    };

    // WYSYŁKA ZAMÓWIENIA (To było brakującym ogniwem)
    window.checkout = async function() {
        if (cart.length === 0) return alert("Koszyk jest pusty!");

        const orderData = {
            items: cart,
            total: cart.reduce((sum, i) => sum + (i.price * i.quantity), 0)
        };

        try {
            const response = await fetch('/save-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();
            if (result.success) {
                alert("Zamówienie złożone pomyślnie!");
                localStorage.removeItem('cart');
                location.reload();
            } else {
                alert("Błąd serwera: " + result.message);
            }
        } catch (error) {
            console.error("Błąd wysyłki:", error);
            alert("Nie udało się połączyć z serwerem.");
        }
    };
});
