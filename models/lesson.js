import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({

    qualification: {
        type: String,
        required: [true, "Please Enter Your Qualification"]
    },

    certification: {
        type: [String],
        required: [true, "Please Enter Your Certification"],
    },

    subject: [
        {
            field: {
                type: String, required: [true, "Please Enter Field"]
            },
            category: {
                type: [String],
                required: [true, "Please Enter Category"]
            },
        }
    ],

    experiance: {
        type: String,
        required: [true, "Please Enter Your Teaching Experiance"]
    },

    speaks: {
        type: [String],
        required: [true, "Please Enter Your Speaks"]
    },

    about: {
        type: String,
        required: [true, "Please Enter Your About"],
        minLength: [20, "About should have more than 20 characters"],
    },

    price: {
        type: Number,
        required: [true, "Please Enter Price"],
        maxLength: [8, "Price cannot exceed 8 characters"],
    },

    country: {
        type: String,
        required: [true, "Please Enter Your Country"]
    },

    city: {
        type: String,
        required: [true, "Please Enter Your City"]
    },

    available: [
        {
            days: { type: String, required: [true, "Please Select Your Available Days"] },
            times: {
                type: [String], required: [true, "Please Select Time"]
            },
        }
    ],

    startDate: {
        type: String,
        required: [true, "Please Enter Start Time"],
    },

    endDate: {
        type: String,
        required: [true, "Please Enter End Time"],
    },

    link: {
        type: String,
        required: [true, "Please Enter Your Meeting Link"],
    },

    ratings: {
        type: Number,
        default: 0,
    },

    numOfReviews: {
        type: Number,
        default: 0,
    },

    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                required: true,
            },
            comment: {
                type: String,
                required: true,
            },
        },
    ],

    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Lesson = mongoose.model("Lesson", lessonSchema);

export default Lesson;
