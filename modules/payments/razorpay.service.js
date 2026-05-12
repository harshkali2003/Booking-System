require("dotenv").config();
const crypto = require("crypto");
const AppError = require("../../common/utils/global.error");
const Payment = require("./razorpay.model");
const razorpay = require("../../config/razorpay.config");
const Booking = require("../booking/booking.model");
const bookingQueue = require("../../queues/booking.queue");

exports.createOrderService = async (bookingId, amount, userId) => {
  if (amount === undefined || amount < 0) {
    throw new AppError("Amount is not valid", 400);
  }

  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt: `RZP-${Date.now()}`,
  });

  const orderData = await Payment.create({
    bookingId,
    userId,
    amount,
    currency: "INR",
    paymentStatus: "PENDING",
    razorpay_order_id: order._id,
  });

  return order;
};

exports.verifyPaymentService = async (
  RZP_ORDER_ID,
  RZP_PAYMENT_ID,
  RZP_SIGNATURE,
  bookingId,
  paymentMethod,
) => {
  if (!RZP_ORDER_ID || !RZP_PAYMENT_ID || !RZP_SIGNATURE) {
    throw new AppError("All fields are required", 400);
  }

  const bookingExists = await Booking.findById(bookingId);

  if (!bookingExists) {
    throw new AppError("Booking doesn't exist", 404);
  }

  const paymentExists = await Payment.findOne({ bookingId });

  if (!paymentExists) {
    throw new AppError("Payment record not found", 404);
  }

  const sign = `${RZP_ORDER_ID}|${RZP_PAYMENT_ID}`;

  const expectedSign = crypto
    .createHmac("sha256", process.env.RZP_KEY_SECRET)
    .update(sign.toString())
    .digest("hex");

  let paymentStatus = "FAILED";

  if (expectedSign === RZP_SIGNATURE) {
    paymentStatus = "SUCCESS";
  }

  const payment = await Payment.findOneAndUpdate(
    {
      bookingId,
    },
    {
      $set: {
        paymentStatus,
        paymentMethod,
        razorpay_order_id: RZP_ORDER_ID,
        razorpay_payment_id: RZP_PAYMENT_ID,
        razorpay_signature: RZP_SIGNATURE,
      },
    },
    {
      new: true,
    },
  );

  if (paymentStatus === "SUCCESS") {
    await bookingQueue.add("confirm-booking", {
      bookingId,
    });
  }

  if (paymentStatus === "FAILED") {
    throw new AppError("Payment verification failed", 400);
  }

  return payment;
};
