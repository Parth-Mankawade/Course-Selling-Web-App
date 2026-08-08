// Initialize a new Node.js project
// Add Express, jsonwebtoken, mongoose to it as a dependency
// Create index.js
// Add route skeleton for user login, signup, purchase a course, sees all courses, sees the purchased courses course
// Add routes for admin login, admin signup, create a course, delete a course, add course content.
// Define the schema for User, Admin, Course, Purchase
// Add a database (mongodb), use dotenv to store the database connection string
// Add middlewares for user and admin auth
// Complete the routes for user login, signup, purchase a course, see course (Extra points - Use express routing to better structure your routes)
// Create the frontend




require('dotenv').config()

const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());

//Routing in express ,the express router
const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");
const { adminRouter } = require("./routes/admin");


//ROUTER
app.use("/api/v1/user" , userRouter);
app.use("/api/v1/course" , courseRouter);
app.use("/api/v1/admin", adminRouter);

async function auth(res , req , next){
  
}

async function main() {
   
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(3000 , () => {
        console.log("Server is listening at port 3000");
    });
}

main();
























