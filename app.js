const express = require('express');
const app = express();
const cors=require("cors");
const jwt = require ("jsonwebtoken");
const path = require('path')



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('./build'))
 
const userdata = require('./src/Model/usermodel')
const productdata = require('./src/Model/productmodel')

const PORT = process.env.PORT || 3001;

function verifyToken(req,res,next){
    console.log(req.headers.authorization)
  
    if(!req.headers.authorization){
       return res.status(401).send("Unauthorized Access")
    }
    var tokens = req.headers.authorization.split(' ')[1];
   
   console.log(tokens)
   if(tokens == "null"){
       return res.status(401).send("Unauthorized Access")
   }
  
   var payload= jwt.verify(tokens , "hiddenkeys")
   console.log(payload)
   if(!payload){
       return res.status(401).send("Unauthorized Access")
   }
   req.userId = payload.subject
        next()
   }



app.get("/api/" , (req,res)=>{
 res.send(`Server Running on ${PORT}`)
});


app.post("/api/signup" , (req,res)=>{
    console.log(req.body);

    var email= req.body.email;
    var password = req.body.password;
    var phonenumber = req.body.phonenumber;
    var username = req.body.username;
    var rankey = Math.floor(Math.random() * 10000000000);

    var adduser = {
        email:email,
        username:username,
        password:password,
        phonenumber:phonenumber,
        rankey:rankey
    }
    var addusers = new userdata(adduser);
    addusers.save();
    res.send({status: true })
})

app.post("/api/login" , (req,res)=>{

    var email = req.body.email
    var password = req.body.password

    userdata.findOne({"email":email , "password":password}).then((data)=>{
        if(data===null){
            console.log(data)
            res.send({status: false , data: 'Incorrect Email and Password'})
        }else{

            let payload = {subject:data.rankey};
            let tokens = jwt.sign(payload , "hiddenkeys")
            res.send({status: true , token:data.rankey , tokens, name:data.username})
            
        }
    })

})


app.post("/api/addproduct" , verifyToken , (req,res)=>{
    // console.log(req.body);
 
    var productname= req.body.productname;
    var category= req.body.category;
    var price= req.body.price;
    var model= req.body.model;
    var place= req.body.place;
    var imageurl= req.body.imageurl;
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = dd + '/' + mm + '/' + yyyy; 
    var uid = req.body.uid
    var name22 = req.body.name22

    console.log(uid)

    userdata.findOne({"rankey":uid , "username":name22}).then((data)=>{
        

        if(data===null){
            res.send({status:false , message:"you need to login to add product"})
        }else if(data){

            var addproduct ={
                productname: productname,
                category: category,
                price: price,
                model: model,
                place: place,
                imageurl: imageurl,
                date:today,
                username:data.username,
                phno:data.phonenumber,
                email:data.email,
            }

            // console.log(addproducts);


            var addproducts = new productdata(addproduct);
            addproducts.save();
            res.send({status: true })
        }
        else{
            res.send({status:false , message:"you need to login to add product"})

        }

    })

})

app.get("/api/getdetails" , (req,res)=>{
    productdata.find().then((data)=>{
        res.send(data)
    })
})

app.get("/api/product/:id" , (req,res)=>{
   var id = req.params.id;
   console.log(id)
   productdata.findById(id).then((data)=>{
    if(data===null){
        console.log("null")
        res.send({status: false , message: 'No data Found'})
    }else{
        console.log(data)
        res.send(data)
    }
   })
})


app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/build/index.html'))
});
 


app.listen( PORT, (req,res)=>{
    console.log(`Server Running on ${PORT}`);
})
