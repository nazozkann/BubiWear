const deleteProductButtonElement= document.querySelectorAll('.delete-btn');

async function deleteProduct(event) {
    const buttonElement = event.target;
    const productId = buttonElement.dataset.productId;
    const csrfToken = buttonElement.dataset.csrf;

    const response = await fetch('/admin/product/' + productId, '?_csrf=' + csrfToken, {
        method: 'DELETE'
    });

    if(!response.ok) {
        alert('Something went wrong');
        return;
    }
    buttonElement.parentElement.parentElement.parentElement.parentElement.remove();
}

deleteProductButtonElement.addEventListener('click', deleteProduct);