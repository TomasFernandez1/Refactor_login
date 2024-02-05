import messageModel from "../models/messages.models.js"

export default class messagesManagerMongo{
    constructor(){}
    async getMessages(){
        return await messageModel.find().lean()
    }
    
    async createMessage(msg){
        return await messageModel.create(msg)
    }
}