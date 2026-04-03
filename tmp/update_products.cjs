const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const ProductSchema = new mongoose.Schema({
    brand: String,
    stock: Number
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function updateProducts() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const result = await Product.updateMany({}, { $set: { brand: 'Nike', stock: 10 } });
        console.log(`Updated ${result.modifiedCount} products with brand: Nike and stock: 10`);
        process.exit(0);
    } catch (error) {
        console.error('Error updating products:', error);
        process.exit(1);
    }
}

updateProducts();
