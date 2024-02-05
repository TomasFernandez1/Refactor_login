import {connect } from 'mongoose';
export const connectDB = async () => {
    try {
        await connect('mongodb+srv://tomasAdmin:0QyJ3SSkPBqPmLpC@cluster-coderhouse.bg10jwi.mongodb.net/ecommerce?retryWrites=true&w=majority')

        console.log('Database connection established');
    } catch (error) {
        console.error(error) 
    }
}

