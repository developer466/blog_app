import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { dbConnection } from "./database/dbConnection.js";
import { errorMiddleware } from "./middlewares/error.js";
import userRouter from "./routes/userRouter.js";
import blogRouter from "./routes/blogRouter.js";
import fileUpload from "express-fileupload";
import cloudinary from "cloudinary";

const app = express();
const PORT=process.env.PORT ||4000;
dotenv.config();

app.use(
    cors({
      origin: [process.env.FRONTEND_URL],
      methods: ["GET", "PUT", "DELETE", "POST"],
      credentials: true,
    })
  );

  app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});
app.use("/api/v1/user", userRouter);
app.use("/api/v1/blog", blogRouter);

dbConnection();
app.use(errorMiddleware);

app.listen(PORT,()=>{
    console.log(`server is running on port: ${PORT}`);
});