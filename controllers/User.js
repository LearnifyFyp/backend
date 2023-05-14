import ErrorHandler from "../utils/errorhandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import User from "../models/users.js";
import Lesson from "../models/lesson.js";
import sendToken from "../utils/jwtToken.js";
import sendEmail from "../utils/sendEmail.js";
import cloudinary from "cloudinary";

// Register User //
export const registerUser = catchAsyncErrors(async (req, res, next) => {

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        width: 1280,
        height: 720,
        crop: "limit",
        folder: "LetsLearn Users Image",
    });


    const { name, email, phone, role, password } = req.body;

    const user = await User.create({
        name,
        email,
        phone,
        role,
        password,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        },
    });

    sendToken(user, 201, res);

    const message = `Welcome to LeatsLearn. 
    Hope you have a good time !
    Here are your detail
    Name -- ${user.name}
    Email -- ${user.email}`;

    await sendEmail({
        email: user.email,
        subject: `Thank you for signin ${user.name}`,
        message,
    });

});


// Search User //
export const searchUser = catchAsyncErrors(async (req, res, next) => {
    const keyword = req.query.search
        ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ],
        }
        : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.status(200).json({
        success: true,
        users,
    });
});




// Login User //
export const loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    // checking if user has given password and email both //
    if (!email || !password) {
        return next(new ErrorHandler("Please Enter Email & Password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    sendToken(user, 200, res);

});


// Logout User //
export const logout = catchAsyncErrors(async (req, res, next) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged Out",
    });
});



// Forgot Password //
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }


    const otp = Math.floor(Math.random() * 1000000);

    user.resetPasswordOtp = otp;

    user.resetPasswordOtpExpire = Date.now() + 2 * 60 * 1000;

    await user.save();

    const message = `Your OTP for reseting the password is ${otp}. If you did not request for this, please ignore this email.`;

    try {
        await sendEmail({
            email: user.email,
            subject: `LetsLearn Password Recovery`,
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });
    } catch (error) {
        user.resetPasswordOtp = undefined;
        user.resetPasswordOtpExpire = undefined;
        return next(new ErrorHandler(error.message, 500));
    }
});



// Reset Password //
export const resetPassword = catchAsyncErrors(async (req, res, next) => {

    const { otp, newPassword, confirmPassword } = req.body;

    const user = await User.findOne({
        resetPasswordOtp: otp,
        resetPasswordOtpExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(
            new ErrorHandler(
                "OTP Invalid or has been Expired",
                400
            )
        );
    }

    if (newPassword !== confirmPassword) {
        return next(
            new ErrorHandler(
                "Password does not matched",
                400
            )
        );
    }

    user.password = newPassword;
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpire = undefined;

    await user.save();

    sendToken(user, 200, res);

});


// Get User Details //
export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user,
    });
});


// Update Password //
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect", 400));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(
            new ErrorHandler(
                "Password does not matched",
                400
            )
        );
    }

    user.password = req.body.newPassword;

    await user.save();

    sendToken(user, 200, res);

});


// Update Profile //
export const updateProfile = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        role: req.body.role,
    }

    if (req.body.avatar) {
        const user = await User.findById(req.user.id);

        const imageId = user.avatar.public_id;

        await cloudinary.v2.uploader.destroy(imageId);

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            width: 1280,
            height: 720,
            crop: "limit",
            folder: "LetsLearn Users Image",
        });

        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        };
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        user,
    });
});



// Get All User -- Admin -- //
export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users,
    });
});



// Get Single User -- Admin -- //
export const getSingleUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`));
    }

    res.status(200).json({
        success: true,
        user,
    });

});


// Update User Role -- Admin -- //
export const updateUserRole = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        roleForAdmin: req.body.roleForAdmin,
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        messsage: "User Update Successfully"
    });
});


// Delete My Account User //
export const deleteMyAccount = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user.id);

    if (!user) {
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`));
    }

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    await Lesson.deleteMany({ user: req.user._id });

    await user.remove();

    res.status(200).json({
        success: true,
        message: "Successfully Delete Your Account",
        user,
    });
});




// Delete User -- Admin -- //
export const deleteUser = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        return next(
            new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400)
        );
    }

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    await Lesson.deleteMany({ user: req.params.id });

    await user.remove();

    res.status(200).json({
        success: true,
        message: "User Deleted Successfully",
        user,
    });
});
