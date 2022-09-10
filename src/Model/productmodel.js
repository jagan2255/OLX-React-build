const mongoose =require("mongoose");
mongoose.connect("mongodb+srv://admin:user123@project1.cfkyt.mongodb.net/datata?retryWrites=true&w=majority")

const Schema = mongoose.Schema;

const DataSchema = new Schema({

    productname: String,
    category: String,
    price: Number,
    model: String,
    place: String,
    imageurl: String,
    date: String,
    username: String,
    phno: Number,
    email: String
})

const datadata = mongoose.model("datadata" , DataSchema)
module.exports = datadata;