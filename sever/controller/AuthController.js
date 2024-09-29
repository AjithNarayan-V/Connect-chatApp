// controller are logic 
import jwt from "jsonwebtoken";
import User from "../models/UserModels.js";
import { compare } from "bcrypt";

const maxAge = 24* 60 * 60 * 1000;
const createTokens = (email, userId) => {
    return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge })
};

export const signup = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send("Please provide email and password");
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send("Username is already taken");
        }
        const user = new User({ email, password });
        await user.save();
        res.cookie("jwt", createTokens(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "None",
        });
        return res.status(201).json({
            users: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
            }
        })
    }
    catch (error) {
        console.error(error);
        // res.status(500).json({error: "Server Error"});
        return res.status(500).send("Internal Server Error");
    }
}
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send("Please provide email and password");
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send("Invalid    email or password User not found");
        }
        const auth = await compare(password, user.password);
        if (!auth) {
            return res.status(400).send("Incorrect password");
        }
        res.cookie("jwt", createTokens(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "None",
        });
        return res.status(200).json({
            users: {
                id: user.id,
                email: user.email,
                profileSetUp: user.profileSetUp,
                username: user.username,
                image: user.image,
                color: user.color,
            }
        })
    }
    catch (error) {
        console.error(error);
        // res.status(500).json({error: "Server Error"});
        return res.status(500).send("Internal Server Error");
    }
}

export const getUserInfo = async (req, res, next) => {
    try {
        const userData = await User.findById(req.userId);
        if (!userData) {
            return res.status(404).send("User with given ID is not found");
        }
        // console.log(req.userId);
        return res.status(200).json({

            id: userData.id,
            email: userData.email,
            profileSetUp: userData.profileSetUp,
            username: userData.username,
            image: userData.image,
            color: userData.color,

        })
    }
    catch (error) {
        console.error(error);
        // res.status(500).json({error: "Server Error"});
        return res.status(500).send("Internal Server Error");
    }
}

export const profile = async (req, res, next) => {
    try {
        // const userId = req;
        const { username, color } = req.body;
        if (!username) {
            return res.status(400).send("Please provide username ");
        }
        const userData = await User.findByIdAndUpdate(req.userId,
            {
                username: username,
                color: color,
                profileSetUp: true
            },
            {
                new: true,
                runValidators: true,
            });

        return res.status(200).json({

            id: userData.id,
            email: userData.email,
            profileSetUp: userData.profileSetUp,
            username: userData.username,
            image: userData.image,
            color: userData.color,

        })
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
}


