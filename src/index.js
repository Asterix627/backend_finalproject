require("dotenv").config();
const express = require("express");
const userRouter = require("./routes/userRouter");
const studentRouter = require("./routes/studentRouter");
const teacherRouter = require("./routes/teacherRouter");
const ekskulRouter = require("./routes/ekskulRouter");
const tokenRouter = require("./routes/tokenRouter");
const app = express();
const port = 3000;
const cors = require("cors");
const bodyParser = require("body-parser");
const errorHandler = require("./config/errorHandler");
const cookieParser = require("cookie-parser");
const { ekskul } = require("../prisma/client");

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.listen(port, () => {
    console.log(`Server is running on PORT ${port}`);
});

app.use("/api", userRouter);
app.use("/api", studentRouter);
app.use("/api", teacherRouter);
app.use("/api", ekskulRouter);
app.use("/api", tokenRouter);

app.use(errorHandler);

app.get("/", (req, res) => {
    res.send("Hello World");
});
