import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const router = express.Router();

const isMongoConnected = () => mongoose.connection.readyState === 1;

const publicUser = (user) => ({
    id: user._id || user.id,
    fullname: user.fullname,
    email: user.email,
    age: user.age,
    height: user.height,
    weight: user.weight,
    gender: user.gender,
    fitnessGoal: user.fitnessGoal,
});

// Register Route
router.post("/register", async (req, res) => {
    const { fullname, email, password, age, height, weight, gender, fitnessGoal } = req.body;
    try {
        const normalizedEmail = email?.trim().toLowerCase();

        if (!fullname || !normalizedEmail || !password || !age || !height || !weight || !gender || !fitnessGoal) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }

        if (!isMongoConnected()) {
            return res.status(503).json({ message: "Database unavailable. Please start MongoDB Atlas and try again." });
        }

        const userExists = await User.findOne({ email: normalizedEmail });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({ fullname, email: normalizedEmail, password, age, height, weight, gender, fitnessGoal });
        const token = generateToken(user._id);

        res.status(201).json({
            ...publicUser(user),
            token,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Login Route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const normalizedEmail = email?.trim().toLowerCase();

        if (!normalizedEmail || !password) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }

        if (!isMongoConnected()) {
            return res.status(503).json({ message: "Database unavailable. Please start MongoDB Atlas and try again." });
        }

        const user = await User.findOne({ email: normalizedEmail });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user._id);
        res.status(200).json({
            ...publicUser(user),
            token,
        });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Me Route (Protected)
router.get("/me", protect, async (req, res) => {
    res.status(200).json(req.user);
}); 

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export default router;
