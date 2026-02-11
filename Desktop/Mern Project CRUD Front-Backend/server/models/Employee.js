import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema({
    name: String,
    email: String,
    mobile: String,
    password: String,

    cart:[
        {
            productsId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Products'
            },
            quantity:{
                type:Number,
                default:1,
            }
        }
    ]
});

const EmployeeModel = mongoose.model("employees", EmployeeSchema)
export default EmployeeModel;