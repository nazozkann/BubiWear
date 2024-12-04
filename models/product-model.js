const { ObjectId } = require('mongodb');

const db = require('../data/database');

class Product {
    constructor(productData) {
        this.title = productData.title;
        this.price = +productData.price;
        this.category = productData.category;
        this.colors = productData.colors || [];
        this.sizes = productData.sizes || [];
        this.image1 = productData.image1 || null;
        this.image2 = productData.image2 || null;
        this.image3 = productData.image3 || null;
        this.image4 = productData.image4 || null;

        this.updateImageData();

        if (productData._id) {
            this.id = productData._id.toString();
        }
    }

    static async findById(productId) {
        const product = await db.getDb().collection('products').findOne({ _id: new ObjectId(productId) });

        if (!product) {
            const error = new Error('Could not find product.');
            error.code = 404;
            throw error;
        }

        product.colors = product.colors || [];
        product.sizes = product.sizes || [];

        return new Product(product);
    }

    static async findAll() {
        const products = await db.getDb().collection('products').find().toArray();
        return products.map((productDocument) => new Product(productDocument));
    }

    static async findByCategory(category) {
        const products = await db.getDb().collection('products').find({ category: category }).toArray();
        return products.map((productDocument) => new Product(productDocument));
    }

    updateImageData() {
        this.imageUrls = [
            this.image1 ? `/products/assets/images/${this.image1}` : null,
            this.image2 ? `/products/assets/images/${this.image2}` : null,
            this.image3 ? `/products/assets/images/${this.image3}` : null,
            this.image4 ? `/products/assets/images/${this.image4}` : null
        ];
    }

    async save() {
        const productData = {
            title: this.title,
            price: this.price,
            category: this.category,
            colors: this.colors,
            sizes: this.sizes,
            image1: this.image1,
            image2: this.image2,
            image3: this.image3,
            image4: this.image4
        };

        if (this.id && ObjectId.isValid(this.id)) {
            const productId = new ObjectId(this.id);
            await db.getDb().collection('products').updateOne(
                { _id: productId },
                { $set: productData }
            );
        } else {
            await db.getDb().collection('products').insertOne(productData);
        }
    }

    async replaceImages(newImages) {
        this.image1 = newImages[0] || this.image1;
        this.image2 = newImages[1] || this.image2;
        this.image3 = newImages[2] || this.image3;
        this.image4 = newImages[3] || this.image4;
        this.updateImageData();
    }

    async remove() {
        const productId = new ObjectId(this.id);
        await db.getDb().collection('products').deleteOne({ _id: productId });
    }
}

module.exports = Product;
