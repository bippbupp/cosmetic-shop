function renderCart() {
    console.log('renderCart вызвана');
    
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSummary = document.getElementById('cart-summary');
    const emptyCart = document.getElementById('empty-cart');
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log('Товаров в корзине:', cart.length);
    
    if (!cartItemsContainer) {
        console.error('Элемент cart-items не найден');
        return;
    }
    
    if (cart.length === 0) {
        if (emptyCart) emptyCart.style.display = 'block';
        if (cartSummary) cartSummary.style.display = 'none';
        cartItemsContainer.innerHTML = '<p class="empty-cart">Ваша корзина пуста</p>';
        return;
    }
    
    if (emptyCart) emptyCart.style.display = 'none';
    if (cartSummary) cartSummary.style.display = 'block';
    
    cartItemsContainer.innerHTML = '';
    let totalPrice = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${item.price} руб. × ${item.quantity} = ${itemTotal} руб.</div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                <span class="quantity-value">${item.quantity}</span>
                <button class="quantity-btn increase" data-id="${item.id}">+</button>
            </div>
            <button class="remove-from-cart" data-id="${item.id}">Удалить</button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    const totalPriceElement = document.getElementById('total-price');
    if (totalPriceElement) {
        totalPriceElement.textContent = totalPrice;
    }
    
    addCartItemEventListeners();
}

function addCartItemEventListeners() {
    console.log('addCartItemEventListeners вызвана');
    
    document.querySelectorAll('.decrease').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            console.log('Уменьшение товара ID:', productId);
            updateQuantity(productId, -1);
        });
    });
    
    document.querySelectorAll('.increase').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            console.log('Увеличение товара ID:', productId);
            updateQuantity(productId, 1);
        });
    });
    
    document.querySelectorAll('.remove-from-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            console.log('Удаление товара ID:', productId);
            removeFromCart(productId);
        });
    });
}

function updateQuantity(productId, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item.id == productId);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity += change;
        
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        
        updateCartCounter();
        renderCart(); 
        
        showNotification(change > 0 ? 'Количество товара увеличено' : 'Количество товара уменьшено');
    }
}

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const item = cart.find(item => item.id == productId);
    const itemName = item ? item.name : 'Товар';
    
    cart = cart.filter(item => item.id != productId);
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    updateCartCounter();
    renderCart();
    
    showNotification(`${itemName} удален из корзины`);
}

function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const cartLinks = document.querySelectorAll('#cart-link, .cart-link');
    cartLinks.forEach(link => {
        link.textContent = `Корзина (${totalItems})`;
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
        </div>
    `;
    
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

function handleOrder() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        showNotification('Корзина пуста! Добавьте товары для оформления заказа');
        return;
    }
    
    const orderForm = document.getElementById('order-form-container');
    if (orderForm) {
        orderForm.style.display = 'block';
        orderForm.scrollIntoView({ behavior: 'smooth' });
    }
}

function cancelOrder() {
    const orderForm = document.getElementById('order-form-container');
    if (orderForm) {
        orderForm.style.display = 'none';
    }
}

function submitOrder(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();
    const address = document.getElementById('address').value.trim();
    const phone = document.getElementById('phone').value.trim();
    
    if (!firstName || !lastName || !address || !phone) {
        showNotification('Пожалуйста, заполните все поля формы!');
        return;
    }
    
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;
    if (!phoneRegex.test(phone)) {
        showNotification('Пожалуйста, введите корректный номер телефона!');
        return;
    }
    
    localStorage.removeItem('cart');
    updateCartCounter();
    
    document.getElementById('order-form').reset();
    
    const orderFormContainer = document.getElementById('order-form-container');
    if (orderFormContainer) {
        orderFormContainer.style.display = 'none';
    }
    
    const orderSuccess = document.getElementById('order-success');
    if (orderSuccess) {
        orderSuccess.style.display = 'block';
        orderSuccess.scrollIntoView({ behavior: 'smooth' });
    }
    
    renderCart();
    
    showNotification('Заказ успешно создан!');
}

function continueShopping() {
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Страница корзины загружена');
    
    const orderBtn = document.getElementById('order-btn');
    if (orderBtn) {
        orderBtn.addEventListener('click', handleOrder);
    }
    
    const cancelBtn = document.getElementById('cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', cancelOrder);
    }
    
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', submitOrder);
    }
    
    const continueBtn = document.getElementById('continue-btn');
    if (continueBtn) {
        continueBtn.addEventListener('click', continueShopping);
    }
    
    renderCart();
    updateCartCounter();
});