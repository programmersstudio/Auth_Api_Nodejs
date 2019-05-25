const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// importing routes
const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');

// now we can use everything which is present in .env file
dotenv.config();

// connect to database
mongoose.connect(process.env.DB_CONNECT,
 { useNewUrlParser: true},
 ()=>{
     console.log('connected to database');
});

// middleware
app.use(express.json());

// routes middleware
app.use('/api/user', authRoutes);
app.use('/api/posts', postsRoutes);

app.listen(3000, () => {
    console.log("Server is up and running at port 3000");
})