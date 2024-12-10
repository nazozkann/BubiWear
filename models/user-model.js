const bcrypt = require('bcryptjs');
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId; // Add this line

const db = require('../data/database');

class User {
    constructor(id, email, password, name, address) {
        this.id = id ? new ObjectId(id) : null;
        this.email = email;
        this.password = password;
        this.name = name;
        this.address = address;
    } 

    static async findById(userId) {
        const uid = new mongodb.ObjectId(userId);

        return db.getDb().collection('users').findOne({ _id: uid }, { projection : { password: 0 } });
    }

    getUserWithSameEmail() {
        return db.getDb().collection('users').findOne({ email: this.email });
    }

    async existsAlready() {
        const existingUser = await this.getUserWithSameEmail();
        if(existingUser) {
            return true;
        }
        return false;
    }

    async signup() {
    const hashedPassword = await bcrypt.hash(this.password, 12);

        await db.getDb().collection('users').insertOne({
            email: this.email,
            password: hashedPassword,
            fullname: this.fullname
        });
    }

    hasMatchingPassword(hashedPassword){
        return bcrypt.compare(this.password, hashedPassword);
    }
}

module.exports = User;