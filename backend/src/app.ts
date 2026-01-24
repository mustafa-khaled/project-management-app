import express from "express";
import cookieSession from "cookie-session";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { errorConverter, errorHandler } from "./middlewares/error";
import { ApiError } from "./utils/ApiError";
import routes from "./routes";
import { config } from "./config/app.config";
import { StatusCodes } from "http-status-codes";

const app = express();

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "session",
    keys: [config.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 100,
    secure: config.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
  }),
);

// enable cors
app.use(
  cors({
    origin: config.FRONTEND_ORIGIN,
    credentials: true,
  }),
);

// v1 api routes
app.use(config.BASE_PATH, routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(StatusCodes.NOT_FOUND, "Not found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
