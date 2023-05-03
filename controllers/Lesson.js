import Lesson from "../models/lesson.js";
import User from "../models/users.js";
import Purchase from "../models/purchase.js";
import ErrorHandler from "../utils/errorhandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import ApiFeatures from "../utils/apiFeatures.js";

// Create Course -- Tutor //
export const createLesson = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user.id);

    const {
        qualification,
        certification,
        subject,
        experiance,
        speaks,
        about,
        price,
        country,
        city,
        available,
        startDate,
        endDate,
        link,
    } = req.body;

    const lesson = await Lesson.create({
        qualification,
        certification,
        subject,
        experiance,
        speaks,
        about,
        price,
        country,
        city,
        available,
        startDate,
        endDate,
        link,
        user,
    });

    res.status(200).json({
        success: true,
        lesson,
    })

});

// Get My Lesson --Tutor //
export const getMyLesson = catchAsyncErrors(async (req, res, next) => {

    const lesson = await Lesson.find({ user: req.user._id }).populate('user');

    if (!lesson) {
        return next(new ErrorHandler("Lesson not found", 404));
    }

    res.status(200).json({
        success: true,
        lesson,
    });
});


// Update My Lesson -- Tutor //
export const updateLesson = catchAsyncErrors(async (req, res, next) => {

    let lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
        return next(new ErrorHandler("Lesson not found", 404));
    }

    lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        lesson,
    })

});


// Delete Course -- Tutor //
export const deleteLesson = catchAsyncErrors(async (req, res, next) => {

    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
        return next(new ErrorHandler("Lesson not found", 404));
    }

    await lesson.remove();

    res.status(200).json({
        success: true,
        message: "Lesson Delete Successfully",
        lesson,
    })

});


// Get All My Purchase Lessons --Student //
// export const myPurchaseLessons = catchAsyncErrors(async (req, res, next) => {

//     const studentId = req.user.id;

//     const purchaseLessons = await Purchase.find({ student: studentId }).populate('lesson').populate('tutor');

//     res.status(200).json({
//         success: true,
//         purchaseLessons,
//     });
// });




// Get All My Purchase Courses  Student //
export const myPurchaseLessons = catchAsyncErrors(async (req, res, next) => {

    const purchase = await Purchase.find({ student: req.user._id });

    console.log(purchase);

    const lessonIds = purchase.map((purchase) => purchase.lesson);

    const lessons = await Lesson.find({ _id: { $in: lessonIds } });

    res.status(200).json({
        success: true,
        lessons,
    });
});








// Get All My Sell Lessons --Tutor //
export const mySellLessons = catchAsyncErrors(async (req, res, next) => {

    const tutorId = req.user.id;

    const sellLessons = await Purchase.find({ tutor: tutorId })
        .populate('lesson').populate('student');

    res.status(200).json({
        success: true,
        sellLessons,
    });
});



// Get All Products //
export const getAllLesson = catchAsyncErrors(async (req, res) => {

    const resultPerPage = 30;

    const lessonCount = await Lesson.countDocuments();

    const apiFeature = new ApiFeatures(Lesson.find(), req.query)
        .search()
        .filter()
        .pagination(resultPerPage);

    const lessons = await apiFeature.query.populate('user');

    res.status(200).json({
        success: true,
        lessons,
        lessonCount,
    })
});


// Get Product Details //
export const getLessonDetails = catchAsyncErrors(async (req, res, next) => {

    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
        return next(new ErrorHandler("Lesson not found", 404));
    }

    res.status(200).json({
        success: true,
        lesson,
    });
});




// Create New Review or Update the Review for Lesson //
export const createLessonReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, lessonId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        avatar: req.user.avatar.url,
        rating: Number(rating),
        comment,
    };

    const lesson = await Lesson.findById(lessonId);

    const isReviewed = lesson.reviews.find(
        (rev) => rev.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
        lesson.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user._id.toString())
                (rev.rating = rating), (rev.comment = comment);
        });
    } else {
        lesson.reviews.push(review);
        lesson.numOfReviews = lesson.reviews.length;
    }

    let avg = 0;

    lesson.reviews.forEach((rev) => {
        avg += rev.rating;
    });

    lesson.ratings = avg / lesson.reviews.length;

    await lesson.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
    });
});


// Get Lesson Reviews //
export const getLessonReviews = catchAsyncErrors(async (req, res, next) => {

    const lesson = await Lesson.findById(req.query.id);

    if (!lesson) {
        return next(new ErrorHandler("Lesson not found", 404));
    }

    res.status(200).json({
        success: true,
        reviews: lesson.reviews,
    })

});


// Delete Lesson Reviews //
export const deleteLessonReview = catchAsyncErrors(async (req, res, next) => {

    const lesson = await Lesson.findById(req.query.lessonId);

    if (!lesson) {
        return next(new ErrorHandler("Lesson not found", 404));
    }

    const reviews = lesson.reviews.filter(
        (rev) => rev._id.toString() !== req.query.id.toString()
    );

    let avg = 0;

    reviews.forEach((rev) => {
        avg += rev.rating;
    });

    let ratings = 0;

    if (reviews.length === 0) {
        ratings = 0;
    } else {
        ratings = avg / reviews.length;
    }

    const numOfReviews = reviews.length;

    await Lesson.findByIdAndUpdate(
        req.query.lessonId,
        {
            reviews,
            ratings,
            numOfReviews,
        },
        {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        }
    );

    res.status(200).json({
        success: true,
    });
});


// Get All Lesson  -- Admin //
export const getAdminLesson = catchAsyncErrors(async (req, res, next) => {

    const lessons = await Lesson.find().populate('user').exec();

    res.status(200).json({
        success: true,
        lessons,
    });
});


// Delete Lesson -- Admin //
export const adminDeleteLesson = catchAsyncErrors(async (req, res, next) => {

    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
        return next(new ErrorHandler("Lesson not found", 404));
    }

    await lesson.remove();

    res.status(200).json({
        success: true,
        message: "Lesson Delete Successfully",
        lesson,
    });
});


// Admin get All Sold Lesson //
export const adminGetAllSoldLesson = catchAsyncErrors(async (req, res, next) => {

    const soldLessons = await Purchase.find().populate('tutor').populate('student').populate('lesson');

    res.status(200).json({
        success: true,
        soldLessons,
    });
})