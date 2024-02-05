import userModel from '../models/users.models.js';

export default class userManagerMongo {
    constructor() {}

    async getUsers(){
        return await userModel.find({})
    }

    async getUserById(id){
        return await userModel.findById({_id: id}).lean()
    }

    async getUser(filters){
        return await userModel.findOne(filters).lean()
    }

    async createUser(newUser){
        return await userModel.create(newUser)
    }

    async updateUser(id, updatedUser){
        return await userModel.findByIdAndUpdate({_id: id}, updatedUser)
    }

    async deleteUser(id){
        return await userModel.delete({_id: id})
    }
}