const mongoose = require("mongoose")
const paymentSchema = new mongoose.Schema({
    bookingId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Booking",
        required : true,
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    amount : {
        type : Number,
        required : true,
        min : 1,
    },
    currency : {
        type : String,
        required : true,
    },
    paymentStatus : {
        type : String,
        enum : ["PENDING" , "SUCCESS" , "FAILED"],
        default : "PENDING",
    },
    paymentMethod : {
        type : String,
        enum : ["UPI", "CARD" , "NETBANKING" , "WALLET"],
        default : "UPI",
    },
    razorpay_order_id : {
        type : String,
        unique : true,
    },
    razorpay_payment_id : {
        type : String,
        unique : true,
    },
    razorpay_signature : {
        type : String,
    }
} , {timestamps : true})

paymentSchema.index({bookingId : 1} , {unique : true})
paymentSchema.index({userId : 1})

module.exports = mongoose.model("Payment" , paymentSchema , "Payment")