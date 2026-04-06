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
            const price = parseFloat(product.querySelector('.price').innerText.replace(/[^\d.,]/g, '').replace(',', '.'));
            const size = product.querySelector('select')?.value || 'One Size';
            
            const existing = cart.find(p => p.name === name && p.size === size);
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push({ name, price, size, quantity: 1 });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            alert(`Dodano: ${name}`);
        });
    });

    // Funkcja otwierania koszyka
    window.showCart = function() {
        const modal = document.getElementById('cartModal');
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        if (!modal || !cartItems) return;

        modal.style.display = 'flex';
        cartItems.innerHTML = cart.length === 0 ? '<p>Koszyk jest pusty</p>' : '';
        
        let total = 0;
        cart.forEach(item => {
            total += item.price * item.quantity;
            cartItems.innerHTML += `
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid #333; padding:5px 0;">
                    <span>${item.name} (${item.size}) x${item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)} zł</span>
                </div>`;
        });
        if (cartTotal) cartTotal.innerText = total.toFixed(2);
    };

    // PRZEJŚCIE DO KASY (To teraz na 100% zadziała)
    window.checkout = function() {
        if (cart.length === 0) return alert("Koszyk jest pusty!");
        window.location.href = "checkout.html"; 
    };

    window.closeCart = (e) => { if(e.target.id==='cartModal'||e.target.className==='close') document.getElementById('cartModal').style.display='none'; };
});
