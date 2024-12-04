const addCartButtonElement = document.querySelector('.product-details-add-to button');
const cartBadgeElements = document.querySelectorAll('nav .badge');
const cartItemElements = document.querySelectorAll('.cart-item');
const cancelButtons = document.querySelectorAll('#cancel-btn');

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
    button.closest('.cart-item').remove();
    cartBadgeElements.forEach((badge) => {
        badge.textContent = responseData.newTotalItems;
    });
}

addCartButtonElement.addEventListener('click', addCart);
cancelButtons.forEach(button => {
    button.addEventListener('click', removeCartItem);
});