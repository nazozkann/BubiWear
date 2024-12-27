const addCartButtonElement = document.querySelector('.button-upload');
const cartBadgeElements = document.querySelectorAll('nav .badge');
const cartItemElements = document.querySelectorAll('.cart-item');
const cancelButtons = document.querySelectorAll('.cancel-btn');

async function addCart(event) {
    event.preventDefault(); // Prevent form submission

    const form = document.getElementById('add-to-cart-form'); // Get the form element
    const formData = new FormData(form); // Read the form content

    const productId = formData.get('productId'); // Get the productId value from the form
    const csrfToken = formData.get('_csrf'); // Get the CSRF token value from the form

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
        badge.style.display = 'none'; // Trigger reflow
        badge.offsetHeight; // Restart the flow
        badge.style.display = ''; // Make it visible again
        badge.textContent = newTotalQuantity; // Set the new value
    });

    window.location.href = '/cart'; // Redirect to the cart page
}

async function removeCartItem(event) {
    const button = event.target;
    const itemId = button.dataset.itemId;
    const csrfToken = button.dataset.csrf;

    let response;
    try {
        response = await fetch(`/cart/items/${itemId}`, {
            method: 'DELETE',
            body: JSON.stringify({
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
    res.render('checkout')
}

if (cancelButtons.length > 0) {
    cancelButtons.forEach(button => {
        button.addEventListener('click', removeCartItem);
    });
}

const checkoutForm = document.getElementById('checkout-form');

if (checkoutForm) {
    checkoutForm.addEventListener('submit', function(event) {
        event.preventDefault();
        fetch('/cart/checkout', {
            method: 'POST',
            body: new URLSearchParams(new FormData(checkoutForm)),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(response => {
            if (response.ok) {
                window.location.href = '/cart/checkout';
            } else {
                alert('Something went wrong!');
            }
        }).catch(error => {
            alert('Something went wrong!');
        });
    });
}

const deleteAddressButtonElements = document.querySelectorAll('.delete-btn');

async function deleteAddress(event) {
    event.preventDefault();
    const buttonElement = event.target;
    const addressId = buttonElement.dataset.productid;
    const csrfToken = buttonElement.dataset.csrf;
    const redirectParam = buttonElement.dataset.redirect; // "profile" or "cart"

    try {
        const response = await fetch(`/cart/update-address/${addressId}?_csrf=${csrfToken}&redirect=${redirectParam}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Failed to delete address.');
        }

        const responseData = await response.json();
        // Remove outer container so radio button is also removed
        buttonElement.closest('article.address-item').closest('div.address-item').remove();

        // Optionally redirect the user if needed:
        if (responseData.redirect === 'profile') {
            window.location.href = '/profile/addresses';
        } else {
            window.location.href = '/cart/checkout';
        }
    } catch (error) {
        alert('An error occurred while deleting the address: ' + error.message);
    }
}

// Delete butonlarına event listener ekle
deleteAddressButtonElements.forEach(button => {
    button.addEventListener('click', deleteAddress);
});