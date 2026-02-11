import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from "cors";
import ProductModel from './models/Products.js';
import EmployeeModel from './models/Employee.js';
import multer from 'multer';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import Employee from './models/Employee.js';


const app = express();
app.use(express.json());
app.use(cookieParser()); 

   app.use(cors({
       origin:'http://localhost:5173',
       credentials:true,
   }));

app.use('/images', express.static('public/images'));
const DB_URI = process.env.MONGO_URL;
// // MongoDB Connecttions
mongoose.connect(DB_URI)
    .then(() => console.log(" MongoDB Atlas Connected Successfully!"))
    .catch((err) => console.log(" Connection Error: ", err));



//  Multer Setting
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images') 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + file.originalname)
    }
})

const upload = multer({ storage: storage });


//  Routes
const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
        if(!token) {
        return res.json("The token is missing");
    } else {
        jwt.verify(token, "jwt_secret_key", (err, decoded) => {
            if(err) {
                return res.json("The token is wrong");
            } else {
                req.user = decoded;
                next();
            }
        });
    }
}
// Register API
// app.post('/register', (req, res) =>{
//     EmployeeModel.create(req.body)
//     .then(employees => res.json(employees))
//     .catch(err => res.json(err))
// })
 app.post('/register', async(req,res)=>{
     try{
        const Employees = await EmployeeModel.create(req.body);
        res.json(Employees)
     }catch(err){
        res.json(err);
     }
 });
// Login API
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    
    EmployeeModel.findOne({ email: email })
    .then(user => {
        if(user) {
            
            if(user.password === password) {
                
                
                
                //  JWT Token 
                const token = jwt.sign(
                    { email: user.email, id: user._id }, 
                    "jwt_secret_key",                    
                    { expiresIn: "1d" }                  
                );

                // 2. Cookie Set 
                res.cookie("token", token, {
                    httpOnly: true, // for Security
                });

                // 3.  Success
                res.json({message:"Success", token:token}); 
                
            } else {
                res.json("Incorrect password");
            }
        } else {
            res.json("Pls Enter valid Email id ");
        }
    })
});
        //   user cart Data
 app.get('/api/cart',verifyUser,async(req,res)=>{
    try{
        const employee = await Employee.findById(req.user.id).populate('cart.productsId');
        if(!employee){
            return res.status(400).json({msg:"Employee nahi Mil raha hai "});
        }
        res.json(employee.cart)
    }catch(err){
         console.error(err.message);
         res.status(500).send('server error')
    }
 });
  
   //  Add Item to Cart (Safe & Crash-Proof)
app.post('/api/cart/add', verifyUser, async (req, res) => {
    try {
        const { productId, quantity } = req.body; 
        const userId = req.user.id; //(store logic in this box (userId))

        const employee = await EmployeeModel.findById(userId);

        if (!employee) {
            return res.status(404).json({ msg: "User not found" });
        }

        const existingItemIndex = employee.cart.findIndex(item => 
            item.productsId && item.productsId.toString() === productId
        );

        if (existingItemIndex > -1) {
            employee.cart[existingItemIndex].quantity += 1;
        } else {
            employee.cart.push({ productsId: productId, quantity: 1 });
        }

        await employee.save();
        res.json({ msg: "Item Added", cart: employee.cart });

    } catch (err) {
        console.error("Error adding to cart:", err);
        res.status(500).send("Server Error");
    }
});
  //  Remove Item from Cart Route 
app.delete('/api/cart/:id', verifyUser, async (req, res) => {
    try {
        const productId = req.params.id; // URL se product ID milegi
        const userId = req.user.id;

        const employee = await EmployeeModel.findById(userId);

        if (!employee) {
            return res.status(404).json({ msg: "User not found" });
        }

        // (Basically delete logic)
        employee.cart = employee.cart.filter(item => 
            item.productsId.toString() !== productId
        );

        await employee.save();
        res.json({ msg: "Item Removed", cart: employee.cart });

    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});
    
 // Add Item to Cart Route 
app.post('/api/cart/add', verifyUser, async (req, res) => {
    try {
        const { productId, quantity } = req.body; // Frontend se productId aayega
        const userId = req.user.id; // Token se user ID milegi

        const employee = await EmployeeModel.findById(userId);

        if (!employee) {
            return res.status(404).json({ msg: "User not found" });
        }

       const existingItemIndex = employee.cart.findIndex(item => 
        item.productId && item.productId.toString() === productId
);
        if (existingItemIndex > -1) {
            // Agar hai, to quantity badha do
            employee.cart[existingItemIndex].quantity += 1;
        } else {
            // Agar nahi hai, to naya item push karo
            employee.cart.push({ productId, quantity: 1 });
        }

        // Save karo database me
        await employee.save();
        res.json({ msg: "Item Added to Cart", cart: employee.cart });

    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});


//  Get All Products
app.get('/products', verifyUser, (req, res) => {
    ProductModel.find()
    .then(products => res.json(products))
    .catch(err => res.json(err))
})

//  Upload Product
app.post('/upload-product', upload.single('file'), (req, res) => {
    ProductModel.create({
        name: req.body.name,
        price: req.body.price,
        qty: req.body.qty,
        desc: req.body.desc,
        image: req.file ? req.file.filename : "" 
    })
    .then(result => res.json(result))
    .catch(err => res.json(err))
})

app.listen(3001, () => {
    console.log("Server is running on port 3001")
})