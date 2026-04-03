const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const OrderSchema = new mongoose.Schema({
    status: String
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

async function updateOrder() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const order = await Order.findOneAndUpdate({}, { $set: { status: 'Delivered' } });
        if (order) {
            console.log(`Updated Order ${order._id} to Delivered`);
        } else {
            console.log('No order found to update');
        }
        process.exit(0);
    } catch (error) {
        console.error('Error updating order:', error);
        process.exit(1);
    }
}

updateOrder();
