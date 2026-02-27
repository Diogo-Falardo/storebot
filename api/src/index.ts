const port = 2109;

var cors = require("cors");
// express
const express = require("express");
import { Request, Response, NextFunction } from "express";
import { HttpError } from "./system/utils/ErrorHandling";

const app = express();
app.use(express.json());

const api = express.Router();
app.use("/kira", api);

// user route
import userRouter from "./system/route/user.route";
api.use("/user", userRouter);

// shop route
import shopRouter from "./system/route/shop.route";
api.use("/shop", shopRouter);

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  // use http error
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      message: err.message,
      details: err.details ?? null,
    });
  }

  console.error(err);
  return res.status(500).json({ message: "Internal server error" });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
