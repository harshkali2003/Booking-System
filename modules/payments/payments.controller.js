const asyncWrapper = require("../../common/utils/asyncWrapper")
const {createOrderService , verifyPaymentService} = require("./payments.service")

const createOrder = asyncWrapper(async (req , resp , next) => {
    const {bookingId} = req.params;
    const {amount} = req.body;

    const userId = req.user;

    const order = await createOrderService(bookingId , amount , userId._id);

    return resp.status(201).json({
        success : true,
        message : "order created",
        data : order,
    })
})

const verifyOrder = asyncWrapper(async (req , resp , next) => {
    const {bookingId} = req.params;
    const {RZP_ORDER_ID , RZP_PAYMENT_ID , RZP_SIGNATURE , paymentMethod} = req.body;

    const order = await verifyPaymentService(RZP_ORDER_ID , RZP_PAYMENT_ID , RZP_SIGNATURE , bookingId , paymentMethod);

    return resp.status(200).json({
        success : true,
        message : "Payment verified",
        data : order,
    })
})

module.exports = {createOrder , verifyOrder}