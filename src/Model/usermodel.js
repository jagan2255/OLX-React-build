const mongoose =require("mongoose");
mongoose.connect("mongodb+srv://admin:user123@project1.cfkyt.mongodb.net/datata?retryWrites=true&w=majority")

const Schema = mongoose.Schema;

const ProductSchema = new Schema({

    email:String,
    password:String,
    username:String,
    phonenumber:Number,
    rankey:String
})

const productdata = mongoose.model("productdata" , ProductSchema)
module.exports = productdata;