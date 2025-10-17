import mongoose from "mongoose";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const db = mongoose.connection.db;
        const userCol = db.collection("user_cred");

        const user = await userCol.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
            { username: user.username, role: user.role },
            process.env.JWT_SECRET || "secretkey",
            { expiresIn: "2h" }
        );

        res.json({
            message: "Login successful",
            token,
            role: user.role,
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};
