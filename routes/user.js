const express = require("express");
const Router = express.Router;

// const { Router } = require("express");

const userRouter = Router();
const { UserModel , PurchaseModel, CoursesModel } = require("../db"); 

const jwt = require("jsonwebtoken");

const { JWT_USER_PASSWORD } = require("../config");
const { userMiddleware } = require("../middlewares/user");


userRouter.post("/signup" , async function(req, res){
        const { email , password , firstName , lastName } = req.body;
        //ADD ZOD VALIDATION
        //HASHPASSWORD , NOP PLAINTEXT PASSWORD TO BE STORED IN DB
        //put inside try catch block
        try{
            await UserModel.create({
                email ,
                password ,
                firstName,  
                lastName
            });
        }catch(e){
            res.status(500).json({
                error : e.message
            })
        }
        

        res.json({
            message : "Signup succeded"
        })
});

userRouter.post("/signin" , async function(req, res){
    const {email , password } = req.body;

    //todo : ideally password should be hashed and hence you cant compare the user provided password and the database password 
    const user = await UserModel.findOne({ //either the user or undefined
        email : email,
        password : password
    }); //[] if find -> still valid therfore error


    if(user){
        const tokken = jwt.sign({
            id:user._id
        } , JWT_USER_PASSWORD);

        //do cookie logic in the future

        res.json({
            token : token
        })
    }
    else{
        res.status(403).json({
            message : "Incorrect credentials"
        })
    }


    res.json({
        message : "Signin endpoint"
    })
});

userRouter.get("/purchases" ,userMiddleware , async function(req , res){
    const userId = req.userId;

    const purchases = await PurchaseModel.find({
        userId,
    })

    // let purchasedCourseIds = [];


    // for(let i = 0 ; i < purchases.length ; i++){
    //     purchasedCourseIds.push(purchases[i].courseId)
    // }

    const coursesData =  await CoursesModel.find({
        _id: { $in : purchases.map(x => x.courseId) }
    })

    res.json({
        purchases,
        coursesData
    })
});

module.exports = {
    userRouter  : userRouter
}