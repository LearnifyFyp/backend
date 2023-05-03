import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },

    message: {
        type: String,
        required: [true, "Please Enter Your Message"],
    },


    createdAt: {
        type: Date,
        default: Date.now,
    },
});


const Contact = mongoose.model("Contact", contactSchema);

export default Contact;