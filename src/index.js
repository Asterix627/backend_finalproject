<<<<<<< HEAD
require("dotenv").config();
const express = require("express");
const userRouter = require("./routes/userRouter");
const teacherRouter = require("./routes/teacherRouter");
const ppdbRouter = require("./routes/ppdbRouter");
const app = express();
const port = 3000;
const cors = require("cors");
const bodyParser = require("body-parser");
const errorHandler = require("./config/errorHandler");
=======

require('dotenv').config();
const express = require('express');
const userRouter = require('./routes/userRouter');
const teacherRouter = require('./routes/teacherRouter');
const ekskulRouter = require('./routes/ekskulRouter')
const app = express();
const port = 3000;
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('./config/errorHandler');
const { ekskul } = require('../prisma/client');
>>>>>>> df1da31c781794e8167d084a0523ea5c385dc303

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.listen(port, () => {
    console.log(`Server is running on PORT ${port}`);
});

<<<<<<< HEAD
app.use("/api", userRouter);
app.use("/api", teacherRouter);
app.use("/api", ppdbRouter);
=======
app.use('/api', userRouter);
app.use('/api', teacherRouter);
app.use('/api', ekskulRouter);

>>>>>>> df1da31c781794e8167d084a0523ea5c385dc303

app.use(errorHandler);

app.get("/", (req, res) => {
    res.send("Hello World");
});
app.get("/", (req, res) => {
    res.send("Hello World");
});
