class Cart {
    constructor(items = [], totalQuantity = 0, totalPrice = 0) {
        this.items = items;
        this.totalQuantity = totalQuantity;
        this.totalPrice = totalPrice;
    }

    addItem(product) {
        const cartItemIndex = this.items.findIndex(item => item.product.id === product.id);

        if (cartItemIndex >= 0) {
            const existingCartItem = this.items[cartItemIndex];
            existingCartItem.quantity++;
            existingCartItem.totalPrice += product.price;
            this.items[cartItemIndex] = existingCartItem;
        } else {
            const newCartItem = {
                product: product,
                quantity: 1,
                totalPrice: product.price,
            };
            this.items.push(newCartItem);
        }

        this.totalQuantity++;
        this.totalPrice += product.price;
    }

    removeItem(productId) {
        const cartItemIndex = this.items.findIndex(item => item.product.id === productId);
        if (cartItemIndex < 0) {
            return;
        }

        const cartItem = this.items[cartItemIndex];
        this.totalQuantity -= cartItem.quantity;
        this.totalPrice -= cartItem.totalPrice;

        this.items.splice(cartItemIndex, 1);
    }
}

module.exports = Cart;