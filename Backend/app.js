import express,{urlencoded} from "express";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import cors from "cors";
import { connectDB } from "./Database/db.js";
import userRouter from "./Routes/userRoutes.js";
import expressFileupload from "express-fileupload";

export const app = express();

config({path: "./Config/config.env"});

app.use(cors({
    origin : ["*"],
    methods : ["GET", "POST", "DELETE", "PUT"],
    credentials : true
}));


app.use(expressFileupload({
    useTempFiles : true,
    tempFileDir : "/temp/",
    parseNested: true
}))


app.use(cookieParser());
app.use(urlencoded({extended: true}));
app.use(express.json());

app.use("/api/v1/user", userRouter);

connectDB();
