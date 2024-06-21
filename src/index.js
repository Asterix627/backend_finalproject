require("dotenv").config();
const express = require("express");
const router = require("./routes/userRouter");
const app = express();
const port = 3000;
const cors = require("cors");
const bodyParser = require("body-parser");
const errorHandler = require("./config/errorHandler");

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.use("/api", router);

app.use(errorHandler);

app.get("/", (req, res) => {
    res.send("Hello World");
});
