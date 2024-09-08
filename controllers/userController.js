const User = require("../models/User");
const catchAsyncError = require("../utils/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const { getDataUri } = require("../utils/dataUri");
const cloudinary = require("cloudinary");

const isStrongPassword = (password) => {
  const uppercaseRegex = /[A-Z]/;
  const lowercaseRegex = /[a-z]/;
  const numericRegex = /\d/;
  const specialCharRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;

  if (
    uppercaseRegex.test(password) &&
    lowercaseRegex.test(password) &&
    numericRegex.test(password) &&
    specialCharRegex.test(password)
  ) {
    return true;
  } else {
    return false;
  }
};

const sendData = async (res, statusCode, user, message) => {
  const token = await user.getToken();
  res.status(statusCode).json({
    success: true,
    user,
    token,
    message,
  });
};

exports.registerUser = catchAsyncError(async (req, res, next) => {
  let { name, email, password } = req.body;
  const file = req.file;
  
  const emailRegex =
    /^\w+([\.-]?\w+)*@[a-z0-9]+([\.-]?[a-z0-9]+)*(\.[a-z]{2,3})+$/;
  if (!emailRegex.test(email)) {
    return next(
      new ErrorHandler("Please Enter a Valid Email In Small Letters", 400)
    );
  }

  const user_exist = await User.findOne({ email });
  if (user_exist) return next(new ErrorHandler(`Email already exists`, 400));

  if (!isStrongPassword(password)) {
    return next(
      new ErrorHandler(
        "Password must contain one Uppercase, Lowercase, Numeric and Special Character",
        400
      )
    );
  }

  let secure_url = null;
  let public_id = null;

  if (file) {
    const fileUri = await getDataUri(file);
    const myCloud = await cloudinary.v2.uploader.upload(fileUri.content, {
      folder: "voosh",
    });

    secure_url = myCloud.secure_url;
    public_id = myCloud.public_id;
  }

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: public_id,
      url: secure_url,
    },
  });

  sendData(res, 201, user, "User Registered Successfully");
});

exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  const emailRegex =
    /^\w+([\.-]?\w+)*@[a-z0-9]+([\.-]?[a-z0-9]+)*(\.[a-z]{2,3})+$/;
  if (!emailRegex.test(email)) {
    return next(
      new ErrorHandler("Please Enter a Valid Email In Small Letters", 400)
    );
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) return next(new ErrorHandler("Invalid Credentials", 401));

  const isPasswordMatched = await user.matchPassword(password);
  if (!isPasswordMatched)
    return next(new ErrorHandler("Invalid Credentials", 401));

  sendData(res, 200, user, "User Logged In Successfully");
});
