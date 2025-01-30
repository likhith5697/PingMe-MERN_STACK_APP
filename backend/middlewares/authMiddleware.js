const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const asyncHandler = require("express-async-handler");



// check if user is logged in or not by verifying with a JWT token (it is generated only after login)
const protect = asyncHandler(async (req, res, next) => {
    let token;

    // if token exists, i.e, user is logged in
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            //decodes token id
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            //finds user by id and return it without password
            req.user = await User.findById(decoded.id).select("-password")
            next(); // goes to below if condition
        } catch (error) {
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    }

    //no token , i.e., user is not logged in
    if (!token) {
        res.status(401);
        throw new Error("Not authorized Login, no token");
    }
});

module.exports = { protect };