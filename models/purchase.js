import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({

    tutor: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },

    student: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },

    lesson: {
        type: mongoose.Schema.ObjectId,
        ref: "Lesson",
        required: true,
    },

    dayTime: {
        type: String,
        required: [true, "Please Enter Your Day And Time"],
    },

    cardNumber: {
        type: Number,
        required: [true, "Please Enter Your Card Number"],
    },

    expireDate: {
        type: String,
        required: [true, "Please Enter Your Card Expire Date"],
    },

    cvcNumber: {
        type: Number,
        required: [true, "Please Enter Your CNIC Code Number"],
    },

    amount: {
        type: Number,
        required: [true, "Please Enter Amount"],
    },

    isDone: {
        type: Boolean,
        default: false,
    },

    date: {
        type: Date,
        default: Date.now,
    },
});

const Purchase = mongoose.model("Purchase", purchaseSchema);

export default Purchase;