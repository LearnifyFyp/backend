import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorhandler.js";
import Purchase from "../models/purchase.js";
import User from "../models/users.js";
import Lesson from "../models/lesson.js";
import sendEmail from "../utils/sendEmail.js";

// Process Purchase Lesson //
export const processPurchase = catchAsyncErrors(async (req, res, next) => {

    const teacher = await Lesson.findById(req.params.id).populate("user");

    const student = await User.findById(req.user);

    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
        return next(new ErrorHandler("Lesson not found", 404));
    }

    const { dayTime, cardNumber, expireDate, cvcNumber, amount } = req.body;

    const purchase = await Purchase.create({
        dayTime,
        cardNumber,
        expireDate,
        cvcNumber,
        amount,
        tutor: teacher.user,
        student,
        lesson,
    });

    // Send email for Tutor //
    try {
        await sendEmail({
            email: teacher.user.email,
            subject: `Your lesson is purchased by a student`,
            message: `Dear Tutor,\n\nYour lesson has been purchased by ${student.name}. Please check your account dashboard for further details.\n\nRegards,\nLets Learn`,
        });

    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }

    // Send email for Student //
    try {
        await sendEmail({
            email: student.email,
            subject: `Lesson Details`,
            message: `Dear Student, Thank you for purchasing a lesson. Here are the details of the lesson:\n\nLesson Date And time ${dayTime}\nMeeting Link: ${teacher.link}`,
        });

    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }

    res.status(200).json({
        success: true,
        purchase,
    });

});



// Compelete Lesson Tutor Mark Done //
export const markDone = catchAsyncErrors(async (req, res, next) => {

    const purchaseId = await Purchase.findById(req.params.id);

    console.log(purchaseId);

    if (!purchaseId) {
        return next(new ErrorHandler("Purchase Lesson not found", 404));
    }

    const doneLesson = {
        isDone: req.body.isDone,
    }

    const purchase = await Purchase.findByIdAndUpdate(req.params.id, doneLesson, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    }).populate('lesson').populate('student');

    res.status(200).json({
        success: true,
        purchase,
    })
});

