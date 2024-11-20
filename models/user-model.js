const bcrypt = require('bcryptjs');
const db = require('../data/database');


class User {
    constructor(email, password, fullname) {
        this.email = email;
        this.password = password;
        this.fullname = fullname;
    } 

    async signup() {
    const hashedPassword = await bcrypt.hash(this.password, 12);

        await db.getDb().collection('users').insertOne({
            email: this.email,
            password: hashedPassword,
            fullname: this.fullname
        });
    }
}

module.exports = User;