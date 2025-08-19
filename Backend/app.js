import express,{urlencoded} from "express";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import cors from "cors";
import { connectDB } from "./Database/db.js";
import userRouter from "./Routes/userRoutes.js";
import expressFileupload from "express-fileupload";
import {removeUnverifiedAccounts} from "./Service/removeUnverifiedAccount.js";
import {removeUnverifiedOtp} from "./Service/removeUnverifiedOtp.js";
import {removeUnverifiedTokens} from "./Service/removeUnverifiedToken.js";
import {notifyUserAccountDelete} from "./Service/notifyAccountDelete.js";

export const app = express();

config({path: "./Config/config.env"});

app.use(cors({
    origin : ["*"],
    methods : ["GET", "POST", "DELETE", "PUT"],
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


app.use("/api/v1/user", userRouter);


removeUnverifiedAccounts();
removeUnverifiedOtp();
removeUnverifiedTokens();
notifyUserAccountDelete();

connectDB();
