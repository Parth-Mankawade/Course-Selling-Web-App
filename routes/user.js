const express = require("express");
const Router = express.Router;



const userRouter = Router();
const { UserModel , PurchaseModel, CoursesModel } = require("../db"); 

const jwt = require("jsonwebtoken");

const { JWT_USER_PASSWORD } = require("../config");
const { userMiddleware } = require("../middlewares/user");


userRouter.post("/signup" , async function(req, res){
        const { email , password , firstName , lastName } = req.body;
    
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

   
    const user = await UserModel.findOne({ 
        email : email,
        password : password
    });


    if(user){
        const tokken = jwt.sign({
            id:user._id
        } , JWT_USER_PASSWORD);

 
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
