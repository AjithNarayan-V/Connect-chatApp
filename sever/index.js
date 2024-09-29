import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
import authRoutes from './routes/AuthRoutes.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;
const databaseurl = process.env.DATABASE_URL;

app.use(cors({
    origin: process.env.ORIGIN || 'http://localhost:5173',  // Use the environment variable or a default
    methods:["GET","POST","DELETE","PATCH","PUT"],
    credentials:true,
}))

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth",authRoutes)

app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

mongoose.connect(databaseurl).then(() => console.log("DB connection established")).catch((err) => console.log(err))