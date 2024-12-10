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
        return;
    }

    removeItem(productId) {
        const cartItemIndex = this.items.findIndex(item => item.product.id === productId);
        if (cartItemIndex < 0) {
            return null;
        }
    
        const cartItem = this.items[cartItemIndex];
    
        if (cartItem.quantity > 1) {
            cartItem.quantity--;
            cartItem.totalPrice -= cartItem.product.price;
            this.totalQuantity--;
            this.totalPrice -= cartItem.product.price;
            return cartItem;
        } else {
            this.totalQuantity -= cartItem.quantity;
            this.totalPrice -= cartItem.totalPrice;
            this.items.splice(cartItemIndex, 1);
            return null;
        }
    }
}

module.exports = Cart;


