
const  { Router } = require("express");
const courseRouter = Router();
const { CoursesModel, UserModel, PurchaseModel } = require("../db"); 
const { userMiddleware } = require("../middlewares/user");


courseRouter.post("/purchase" , userMiddleware ,async function(req,res){
    const userId = req.userId;
    const courseId = req.body.courseId;


    await PurchaseModel.create({
        userId,
        courseId
    })

    res.json({
        message : "You have succesfully course"
    })
});

courseRouter.get("/preview" , async function(req, res){
    const courses = await CoursesModel.find({});

    res.json({
       courses
    })
});

module.exports = {
    courseRouter : courseRouter
}
