import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import nodemailer from "nodemailer";
const authRouter = express.Router();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
authRouter.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    // now save user
    const newUser = new User({
      username,
      email,
      password: hashPassword,
    });
    //generate token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "5m",
    });
    newUser.verificationToken = token;
    await newUser.save();
    //send email
    const verifyLink = `${process.env.FRONT_END_URL}/api/auth/verify/${token}`;
    await transporter.sendMail({
      to: email,
      subject: "Verify you Email",
      html: `<a href="${verifyLink}">Click here to verify</a>`,
    });
    res.status(201).json({
      message: "Registered. Please check your email for verification link.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

//verify email
authRouter.get("/verify/:token", async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(400).json({ message: "Invalid Token" });
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
    res.json({ message: "Email verified Successfully!" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Token expired or invalid" });
  }
});
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found." });

    //if user hai to password match krengy
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password!" });

    if (!user.isVerified)
      return res
        .status(400)
        .json({ message: "Please verify your email first." });

    //when user find and pass match we wil assign them token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// forgot password
authRouter.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "5m",
  });
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpire = Date.now() + 5 * 60 * 1000;

  await user.save();

  const resetLink = `${process.env.FRONT_END_URL}/reset-password/${resetToken}`;
  await transporter.sendMail({
    to: email,
    subject: "Reset Password",
    html: `<a href="${resetLink}">Click here to reset password</a>`,
  });
  res.json({ message: "Reset password link sent to email." });
});
//Reset password
authRouter.post("/reset-password/:token", async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(400).json({ message: "Invalid token" });
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: "Password reset successful." });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Token expired or invalid." });
  }
});

// resend verification email
authRouter.post("/resend-verification", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });
  if (user.isVerified)
    return res.status(400).json({ message: "Already verified" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "5m",
  });
  user.verificationToken = token;
  await user.save();

  const verifyLink = `${process.env.FRONT_END_URL}/verify/${token}`;
  await transporter.sendMail({
    to: email,
    subject: "Resend Verification",
    html: `<a href="${verifyLink}">Click here to verify</a>`,
  });
  res.json({ message: "Verification email resent" });
});

// logout
authRouter.post("/logout", (req, res) => {
  res.json({ message: "Logged out successfully" });
});
export { authRouter };
