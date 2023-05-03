import ErrorHandler from "../utils/errorhandler.js";
import catchAsyncErrors from "./catchAsyncErrors.js";
import jwt from "jsonwebtoken";
import User from "../models/users.js";


export const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHandler("Please Login to access this resource", 401));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodedData.id);

    next();
});



// export const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
//     let token;

//     for (let i = 0; i < req.rawHeaders.length; i++) {
//         const check = req.rawHeaders[i].split(" ");
//         if (check[0] == "Bearer") {
//             token = check;
//         }
//     }

//     if (!token[1]) {
//         return next(new ErrorHandler("Please Login to access this resource", 401));
//     }

//     const decodedData = jwt.verify(token[1], process.env.JWT_SECRET);

//     req.user = await User.findById(decodedData.id);

//     next();
// });



// Roles For Admin And User //
export const authorizeRolesForAdmin = (...rolesForAdmin) => {
    return (req, res, next) => {
        if (!rolesForAdmin.includes(req.user.roleForAdmin)) {
            return next(
                new ErrorHandler(
                    `Role: ${req.user.roleForAdmin} is not allowed to access this resource `,
                    403
                )
            );
        }

        next();
    };
};


// Roles For Tutor And Student //
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(
                    `Role: ${req.user.role} is not allowed to access this resource `,
                    403
                )
            );
        }

        next();
    };
};