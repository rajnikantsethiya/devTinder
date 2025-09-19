const mongoose = require('mongoose');

const username = 'rsethiya';
const password = 'Tryth%40t1';

const connectDB = async () => {
    await mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.cynylnl.mongodb.net/devTinder`);
};

module.exports = {
    connectDB
}



