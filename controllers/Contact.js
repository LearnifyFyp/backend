import ErrorHandler from "../utils/errorhandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import User from "../models/users.js";
import Contact from "../models/contact.js";
import sendEmail from "../utils/sendEmail.js";


// user create contact //
export const createContact = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user.id);

    const { message } = req.body;

    const contact = await Contact.create({
        user,
        message,
    });

    await sendEmail({
        email: user.email,
        subject: `Thank you for Contacting Us LetsLearn.`,
        message: `Name: ${user.name}
        Email: ${user.email}
        Your Messsage Is: ${contact.message}`,
    });

    res.status(200).json({
        success: true,
        contact,
    });
});


// Get All Courses -- Admin //
export const getAdminContacts = catchAsyncErrors(async (req, res, next) => {

    const contacts = await Contact.find().populate('user');

    if (!contacts) {
        return next(new ErrorHandler("Contacts not found", 404));
    }

    res.status(200).json({
        success: true,
        contacts,
    });
});


// Get All Courses -- Admin //
export const getAdminContact = catchAsyncErrors(async (req, res, next) => {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
        return next(new ErrorHandler("Contact not found", 404));
    }

    console.log(contact);

    res.status(200).json({
        success: true,
        contact,
    });
});


// Delete Course -- Admin //
export const adminDeleteContact = catchAsyncErrors(async (req, res, next) => {

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
        return next(new ErrorHandler("Contact not found", 404));
    }

    await contact.remove();

    res.status(200).json({
        success: true,
        message: "Contact Delete Successfully",
        contact,
    });
});