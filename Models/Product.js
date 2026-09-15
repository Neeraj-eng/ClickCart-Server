import mongoose from "mongoose"

const productshema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    brand : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    category : {
        type : String,
        enum : ["Slect category","Laptop","Headphone","Mobile","Electronics","Toys","Fasion"],
        required : true
    },
    quantity  : {
        type : Number,
        required : true,
        min : [1,"quantity must be at least 1"]
    },
    date : {
        type: String,
        default : () => {
            const d = new Date();
            return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`
        }
    },
    image: {
        type: String,
        required: true
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    }
},{
    timestamps: true 
})

export default mongoose.model("Product", productshema);