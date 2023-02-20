const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
const userRoute = require('./routes/users');
const pinRoute = require('./routes/pins');

dotenv.config();

app.use(express.json());

mongoose.set('strictQuery', true);
mongoose
.connect(process.env.MONGO_URL, {useNewUrlParser: true})
.then(() => {
    console.log('MongoDB Connected!');
})
.catch((err) => console.log(err));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://pindrop.onrender.com"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/api/users', userRoute);
app.use('/api/pins', pinRoute);

app.listen(8000||process.env.PORT, () => {
    console.log('App is running on port 8000! XD');
})
