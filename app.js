const express = require('express');
const cors = require('cors');
const { connectDB } = require('./database');
const app = express();
const cookieParser = require('cookie-parser');
const { authRouter } = require('./routes/auth');
const { profileRouter } = require('./routes/profile');
const { userRouter } = require('./routes/user');
const { connectionRouter } = require('./routes/connection');
const { feedRouter } = require('./routes/feed');

app.use(express.json());
app.use(cookieParser());
// Adding cors as middleware and allowing requests from localhost:5173 only. 
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', userRouter);
app.use('/', connectionRouter);
app.use('/', feedRouter);

connectDB().then(() => {
    console.log("Database connection is established");
    app.listen(3000, () => {
        console.log('Application is running on port 3000')
    });
}).catch(() => {
    console.log("Database couldn't be connected!");
});



