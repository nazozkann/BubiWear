const mongodb = require('mongodb');

const db = require('../data/database');

class Product {
    constructor(productData) {
        this.title = productData.title;
        this.price = +productData.price;
        this.category = productData.category;
        this.colors = productData.colors || []; // Varsayılan değer
        this.sizes = productData.sizes || []; // Varsayılan değer
        this.images = Array.isArray(productData.images) ? productData.images : []; // Varsayılan değer

        this.updateImageData(); // imagePaths ve imageUrls oluşturulur

        // _id varsa, bunu string olarak kaydediyoruz.
        if (productData._id) {
            this.id = productData._id.toString();
        }
    }

    static async findById(productId) {
        let prodId;
        try {
            prodId = new mongodb.ObjectId(productId);
        } catch (error) {
            error.code = 404;
            throw error;
        }
        const product = await db.getDb().collection('products').findOne({ _id: prodId });

        if (!product) {
            const error = new Error('Could not find product.');
            error.code = 404;
            throw error;
        }

        return new Product(product);
    }

    // Tüm ürünleri döndürür
    static async findAll() {
        const products = await db.getDb().collection('products').find().toArray();

        // Veritabanından alınan her belgeyi Product nesnesine dönüştürür
        return products.map((productDocument) => new Product(productDocument));
    }

    updateImageData() {
        // this.images kullanılarak imagePaths ve imageUrls oluşturulur
        this.imagePaths = this.images.map((image) => `product-data/images/${image}`);
        this.imageUrls = this.images.map((image) => `/products/assets/images/${image}`);
    }

    // Ürünü kaydeder
    async save() {
        const productData = {
            title: this.title,
            price: this.price,
            category: this.category,
            colors: this.colors,
            sizes: this.sizes,
            images: this.images // Resim isimlerini kaydediyoruz
        };
    
        if (this.id && mongodb.ObjectId.isValid(this.id)) {
            const productId = new mongodb.ObjectId(this.id);
            await db.getDb().collection('products').updateOne(
                { _id: productId },
                { $set: productData }
            );
        } else {
            await db.getDb().collection('products').insertOne(productData);
        }
    }

    async replaceImage(newImages) {
        this.images = Array.isArray(newImages) ? newImages : [];
        this.updateImageData();
    }

    async remove() {
        const productId = new mongodb.ObjectId(this.id);
        await db.getDb().collection('products').deleteOne({ _id: productId });
    }
}

module.exports = Product;