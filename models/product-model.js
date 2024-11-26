const mongodb = require('mongodb');

const db = require('../data/database');

class Product {
    constructor(productData) {
        this.title = productData.title;
        this.price = +productData.price;
        this.category = productData.category;
        this.colors = productData.colors; 
        this.sizes = productData.sizes; 

        // Gelen images bir array mi? Kontrol ediyoruz, değilse boş array yapıyoruz.
        this.images = Array.isArray(productData.images) ? productData.images : [];
        
        // Dosya yollarını ve URL'lerini her bir resim için oluşturuyoruz.
        this.imagePaths = this.images.map(image => `product-data/images/${image}`);
        this.imageUrls = this.images.map(image => `/products/assets/images/${image}`);

        // _id varsa, bunu string olarak kaydediyoruz.
        if (productData._id) {
            this.id = productData._id.toString();
        }
    }

    static async findById(productId) {
        let prodId;
        try {
            prodId = new mongodb.ObjectId(productId);
        } catch(error) {
            error.code = 404;
            throw error;
        }
        const product = await db.getDb().collection('products').findOne({ _id: prodId });

        if(!product) {
            const error = new Error('Could not find product.');
            error.code = 404;
            throw error;
        }

        return product;
    }

    // Tüm ürünleri döndürür
    static async findAll() {
        const products = await db.getDb().collection('products').find().toArray();

        // Veritabanından alınan her belgeyi Product nesnesine dönüştürür
        return products.map(function(productDocument) {
            return new Product(productDocument);
        });
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

        // Veritabanına ekliyoruz
        await db.getDb().collection('products').insertOne(productData);
    }
}

module.exports = Product;