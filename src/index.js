require("dotenv").config();
const express = require("express");
const router = require("./routes/userRouter");
const app = express();
const port = 3000;
const cors = require("cors");
const bodyParser = require("body-parser");
const errorHandler = require("./config/errorHandler");

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(bodyParser.urlencoded({ extended : false }));

app.use(bodyParser.json());

app.listen(port, () => {
    console.log(`Server is running on PORT ${port}`)
});

app.use("/api", router);
app.use('/api', userRouter);
app.use('/api', ekskulRouter);

app.use(errorHandler);

app.get("/", (req, res) => {
    res.send("Hello World");
});
app.get('/', (req, res) => {
    res.send('Hello World')
})
