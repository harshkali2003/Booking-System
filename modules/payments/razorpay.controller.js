require("dotenv").config()
const Razorpay = require("razorpay")
const crypto = require("crypto")
const asyncWrapper = require("../../common/utils/asyncWrapper")
const AppError = require("../../common/utils/global.error")
const Payment = require("./razorpay.model")

const razorpay = new Razorpay({
    key_id : process.env.RZP_KEY_ID,
    key_secret : process.env.RZP_KEY_SECRET,
})

const createOrder = asyncWrapper(async (req , resp , next) => {
    const {amount} = req.body;
    if(amount === undefined || amount < 0){
        throw new AppError("Amount is not valid" , 400)
    }

    const order = await razorpay.orders.create({
        amount : amount * 100 ,
        currency : "INR",
        receipt : `RZP-${Date.now()}`
    })

    return resp.status(201).json({
        success : true,
        message : "order created",
        data : order,
    })
})

const verifyOrder = asyncWrapper((req , resp , next) => {
    const {RZP_ORDER_ID , RZP_PAYMENT_ID , RZP_SIGNATURE} = req.body;
    if(!RZP_ORDER_ID || !RZP_PAYMENT_ID || !RZP_SIGNATURE){
        throw new AppError("All fields are required" , 400)
    }

    const sign = RZP_ORDER_ID + "|" + RZP_PAYMENT_ID
    const expectedSign = crypto
    .createHmac("sha256" , process.env.RZP_KEY_SECRET)
    .update(sign.toString())
    .digest("hex")

    if(expectedSign !== RZP_SIGNATURE){
        throw new AppError("Payment not verified" , 400)
    }

    return resp.status(200).json({
        success : true,
        message : "Payment verified",
    })
})

module.exports = {createOrder , verifyOrder}