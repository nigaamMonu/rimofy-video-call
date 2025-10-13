import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// local imports
import User from "../models/User.js";
import { upsertStreamUser } from "../config/stream.js";

// /api/auth/signup
export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Password must be at least 6 characters long.",
        });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Please enter a valid email address.",
        });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists. Please login" });
    }

    // for profile pic
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create a new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      profilePic: randomAvatar,
    });

    await newUser.save();

    // creating the user  in stream as well

    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilePic || "",
      });
    } catch (err) {
      console.error("Error creating Stream user:", err);
    }

    // generate jwt token for the user
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    // set the token in httpOnly cookie
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    res
      .status(201)
      .json({
        success: true,
        message: "User created successfully",
        user: newUser,
      });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
};

// /api/auth/login
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({
          success: false,
          message: "User does not exist. Please signup",
        });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // generate jwt token for the user
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV == "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res
      .status(200)
      .json({ success: true, message: "User logged in successfully", user });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
};

// /api/auth/logout
export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV == "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res
      .status(200)
      .json({ success: true, message: "User logged out successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
};

// api/auth/onboarding
export const onboard = async (req, res) => {
  try {
    const userId = req.user._id; // from protected route middleware
    const {
      fullName,
      bio,
      nativeLanguage,
      learningLanguage,
      location,
      profilePic,
    } = req.body;

    if (
      !fullName ||
      !bio ||
      !nativeLanguage ||
      !learningLanguage ||
      !location
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required ",
        missingFields: [
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location",
        ].filter(Boolean), // remove falsy values,
      });
    }

    // update the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        isOnBoarded: true,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // also update the user in stream
    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || "",
      });
    } catch (err) {
      console.error("Error updating Stream user:", err);
    }

    res
      .status(200)
      .json({
        success: true,
        message: "User onboarded successfully",
        user: updatedUser,
      });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
};
