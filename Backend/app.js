import express,{urlencoded} from "express";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import cors from "cors";
import authRouter from "./Routes/auth.routes.js";
import userRouter from "./Routes/user.routes.js";
import blogRouter from "./Routes/blog.routes.js";
import likeRouter from "./Routes/like.routes.js";
import commentRouter from "./Routes/comment.routes.js";
import subscribeRouter from "./Routes/subscribe.routes.js";
import expressFileupload from "express-fileupload";
import {removeUnverifiedAccounts} from "./Service/removeUnverifiedAccount.js";
import {removeUnverifiedOtp} from "./Service/removeUnverifiedOtp.js";
import {removeUnverifiedTokens} from "./Service/removeUnverifiedToken.js";
import {notifyUserAccountDelete} from "./Service/notifyAccountDelete.js";
import {updateOtpAttempt} from "./Service/updateOtpAttempt.js"
import {updateTokenAttempt} from "./Service/updateTokenAttempt.js"

export const app = express();

config({path: "./Config/config.env"});

app.use(cors({
    origin : ["http://localhost:5173", "http://localhost:5174"],
    methods : ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials : true
}));


app.use(cookieParser());


app.use(expressFileupload({
    useTempFiles : true,
    tempFileDir : "/temp/",
    parseNested: true,
    createParentPath: true,
    limits: { 
        fileSize: 50 * 1024 * 1024 
    },
}));


app.use(express.json());
app.use(urlencoded({extended: true}));


app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/blog", blogRouter);
app.use("/api/v1/like", likeRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/subscribe", subscribeRouter);


removeUnverifiedAccounts();
removeUnverifiedOtp();
removeUnverifiedTokens();
notifyUserAccountDelete();
updateOtpAttempt();
updateTokenAttempt()

// connectDB();
