import {Schema, model} from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productColecction = 'products'

const productsSchema = new Schema({
    title: String,
    description: String,
    code: {
        type: String,
        required: true,
        unique: true
    },  
    price: Number,
    status: Boolean,
    stock: Number,
    category: String,
    thumbnail: {
        type: String,
        required: false
    }
})

productsSchema.plugin(mongoosePaginate)
export default model(productColecction, productsSchema)

