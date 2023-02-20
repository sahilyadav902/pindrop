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

app.use('/api/users', userRoute);
app.use('/api/pins', pinRoute);

app.listen(8000, () => {
    console.log('App is running on port 8000! XD');
})
