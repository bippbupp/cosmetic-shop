function addToCart(productId, productName, productPrice) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    updateCartCounter();
    
    showNotification('Товар добавлен в корзину! Нажмите чтобы перейти →', true);
}

function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartLink = document.getElementById('cart-link');
    if (cartLink) {
        cartLink.textContent = 'Корзина (' + totalItems + ')';
    }
}

function addCartEventListeners() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const productName = this.getAttribute('data-name');
            const productPrice = parseInt(this.getAttribute('data-price'));
            
            addToCart(productId, productName, productPrice);
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    addCartEventListeners();
    updateCartCounter();
});

function showNotification(message, redirectToCart = false) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
        </div>
    `;
    
    if (redirectToCart) {
        notification.style.cursor = 'pointer';
        notification.addEventListener('click', function() {
            window.location.href = 'cart.html';
        });
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}