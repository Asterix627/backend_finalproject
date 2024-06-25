require('dotenv').config()
const express = require('express')
const userRouter = require('./routes/userRouter')
const ekskulRouter = require('./routes/ekskulRouter')
const app = express()
const port = 3000
const cors = require('cors')
const bodyParser = require('body-parser')
const errorHandler = require('./config/errorHandler')

app.use(cors());

app.use(bodyParser.urlencoded({ extended : false }));

app.use(bodyParser.json());

app.listen(port, () => {
    console.log(`Server is running on PORT ${port}`)
});

app.use('/api', userRouter);
app.use('/api', ekskulRouter);

app.use(errorHandler)

app.get('/', (req, res) => {
    res.send('Hello World')
})
