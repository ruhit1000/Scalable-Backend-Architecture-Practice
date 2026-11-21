import express, {
  type Application,
  type Request,
  type Response,
} from "express";
const app: Application = express();
import { userRoute } from "./modules/users/user.route.js";
import { profileRoute } from "./modules/profile/profile.route.js";
import { authRoute } from "./modules/auth/auth.route.js";
import logger from "./middleware/logger.js";
import globalErrorHandler from "./middleware/globalErrorHandler.js";
import cors from "cors";
import cookieParser from "cookie-parser";

var corsOptions = {
  origin: ["http://localhost:3000"],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.text());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.use("/api/v1/users", userRoute);
app.use("/api/v1/profiles", profileRoute);
app.use("/api/v1/auth", authRoute);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "This is root route",
    author: "Ruhit",
  });
});

app.use(globalErrorHandler);

export default app;
