import express from "express";
import { catchAsync } from "../utils/catchAsync";
import { StatusCodes } from "http-status-codes";

const router = express.Router();

router.get(
  "/health",
  catchAsync(async (req, res) => {
    res
      .status(StatusCodes.OK)
      .send({ status: "OK", message: "Backend is running smoothly" });
  }),
);

export default router;
