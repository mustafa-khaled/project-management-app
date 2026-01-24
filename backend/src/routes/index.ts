import express from "express";

const router = express.Router();

router.get("/health", (req, res, next) => {
  res
    .status(200)
    .send({ status: "OK", message: "Backend is running smoothly" });
});

export default router;
