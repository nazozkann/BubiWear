const { ObjectId } = require('mongodb');
const getDb = require('../data/database').getDb; // getDb fonksiyonunu içe aktar

class Design {
    constructor(designData) {
        this.color = designData.color;
        this.frontImage = designData.frontImage || null;
        this.backImage = designData.backImage || null;
        this.price = this.calculatePrice();
        this.quantity = 1;
        this.title = 'Your Design';

        if (designData._id) {
            this.id = designData._id.toString();
        }
    }

    calculatePrice() {
        let price = 0;
        if (this.frontImage || this.backImage) price = 500;
        if (this.backImage && this.frontImage) price = 800;
        return price;
    }

    async save() {
        const db = getDb(); // Ensure the database connection is obtained
        const designData = {
            color: this.color,
            frontImage: this.frontImage,
            backImage: this.backImage,
            price: this.price,
            quantity: this.quantity,
            title: this.title
        };
        const result = await db.collection('designs').insertOne(designData);
        this.id = result.insertedId.toString(); // Ensure the ID is correctly set
    }

    static async findById(designId) {
        if (!ObjectId.isValid(designId)) {
            throw new Error('Invalid design ID format');
        }
    
        const db = getDb();
        const design = await db.collection('designs').findOne({ _id: new ObjectId(designId) });
    
        if (!design) {
            throw new Error('Design not found');
        }
    
        return new Design({
            ...design, // Veritabanından gelen tüm bilgileri aktar
            title: design.title || 'Custom Design',
            price: design.price || 500 // Varsayılan bir fiyat atanabilir
        });
    }
}

module.exports = Design;