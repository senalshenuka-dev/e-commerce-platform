const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const OrderSchema = new mongoose.Schema({
    status: String
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

async function updateAllOrders() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const result = await Order.updateMany({}, { $set: { status: 'delivered' } });
        console.log(`Updated ${result.modifiedCount} orders to Delivered (lowercase)`);
        process.exit(0);
    } catch (error) {
        console.error('Error updating orders:', error);
        process.exit(1);
    }
}

updateAllOrders();
