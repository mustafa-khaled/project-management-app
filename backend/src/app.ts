import express from "express";
import session from "express-session";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import passport from "passport";
import { StatusCodes } from "http-status-codes";
import { errorConverter, errorHandler } from "./middlewares/error";
import { ApiError } from "./utils/ApiError";
import { config } from "./config/app.config";

import authRoutes from "./routes/auth.route";
import routes from "./routes";

const app = express();

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

const BASE_PATH = config.BASE_PATH;

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      secure: config.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

// enable cors
app.use(
  cors({
    origin: config.FRONTEND_ORIGIN,
    credentials: true,
  }),
);

// v1 api routes
app.use(BASE_PATH, routes);

// auth routes
app.use(`${BASE_PATH}/auth`, authRoutes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError("Not found", StatusCodes.NOT_FOUND));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
