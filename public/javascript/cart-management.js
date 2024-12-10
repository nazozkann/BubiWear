const addCartButtonElement = document.querySelector('.product-details-add-to button');
const cartBadgeElements = document.querySelectorAll('nav .badge');
const cartItemElements = document.querySelectorAll('.cart-item');
const cancelButtons = document.querySelectorAll('.cancel-btn');

async function addCart() {
    const productId = addCartButtonElement.dataset.productId;
    const csrfToken = addCartButtonElement.dataset.csrf;

    let response;
    try {
        response = await fetch('/cart/items', {
            method: 'POST',
            body: JSON.stringify({
                productId: productId,
                _csrf: csrfToken
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        alert('Something went wrong!');
        return;
    }

    if (!response.ok) {
        alert('Something went wrong!');
        return;
    }

    const responseData = await response.json();

    const newTotalQuantity = responseData.newTotalItems;

    cartBadgeElements.forEach((badge) => {
        badge.style.display = 'none'; // Yeniden çizimi tetikle
        badge.offsetHeight; // Akışı yeniden başlat
        badge.style.display = ''; // Tekrar görünür yap
        badge.textContent = newTotalQuantity; // Yeni değeri ata
    });
}

async function removeCartItem(event) {
    const button = event.target;
    const productId = button.dataset.productId;
    const csrfToken = button.dataset.csrf;

    let response;
    try {
        response = await fetch(`/cart/items/${productId}`, {
            method: 'DELETE',
            body: JSON.stringify({
                productId: productId,
                _csrf: csrfToken
            }),
            headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': csrfToken
            }
        });
    } catch (error) {
        alert('Something went wrong!');
        return;
    }

    if (!response.ok) {
        alert('Something went wrong!');
        return;
    }

    const responseData = await response.json();
    const cartItemElement = button.closest('.cart-item');
    const quantityElement = cartItemElement.querySelector('.item-details-2 p');
    const totalPriceElement = document.querySelector('.total-info p:last-child');
    const cartAreaElement = document.querySelector('.cart-area');

    if (responseData.newQuantity > 0) {
        quantityElement.textContent = `Quantity: ${responseData.newQuantity}`;
    } else {
        cartItemElement.remove();
    }

    totalPriceElement.textContent = `${responseData.newTotalPrice.toFixed(2)}₺`;

    cartBadgeElements.forEach((badge) => {
        badge.textContent = responseData.newTotalItems;
    });

    if (responseData.newTotalItems === 0) {
        cartAreaElement.innerHTML = '<p>Your cart is empty.</p>';
    }
}

if (addCartButtonElement) {
    addCartButtonElement.addEventListener('click', addCart);
}

if (cancelButtons.length > 0) {
    cancelButtons.forEach(button => {
        button.addEventListener('click', removeCartItem);
    });
}