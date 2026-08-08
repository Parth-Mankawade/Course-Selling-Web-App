const { Router } = require("express");
const adminRouter = Router();
const { AdminModel , PurchaseModel, CoursesModel } = require("../db"); 


//auth
const jwt = require("jsonwebtoken");
const { default: z } = require("zod");

const { JWT_ADMIN_PASSWORD } = require("../config");
const { adminMiddleware } = require("../middlewares/admin");
const course = require("./course");




// adminRouter.use(adminMiddleware);

adminRouter.post("/signup" , async function(req, res){

    const { email , password , firstName , lastName } = req.body;
 
        try{
            await AdminModel.create({
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

adminRouter.post("/signin" , async function(req,res){
    const {email , password } = req.body;
    
       
        const admin = await AdminModel.findOne({ 
            email : email,
            password : password
        });
    
    
        if(admin){
            const tokken = jwt.sign({
                id:user._id
            } , JWT_ADMIN_PASSWORD);
    

    
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


adminRouter.post("/course" , adminMiddleware , async function(req,res){
    const adminId = req.adminId;

    const {title , description , imageUrl , price } = req.body;


  
    const course = await CoursesModel.create({
        title :title,
        description: description ,
        imageUrl:  imageUrl ,
        price : price ,
        creatorId : adminId
    })

    res.json({
        message : "Course created" ,
        courseId : course._id
    })
});


adminRouter.put("/course" , adminMiddleware ,async function(req,res){
     const adminId = req.adminId;

    const {title , description , imageUrl , price , courseId} = req.body;


    const course = await CoursesModel.findOne({
        _id : courseId,
        creatorId : adminId 
    })

    if(!course){
        res.json({
            message : "Not your course"
        })
        return;
    }


    const course = await CoursesModel.updateOne( {
        _id: courseId,
        creatorId : adminId
    },{
        title :title,
        description: description ,
        imageUrl:  imageUrl ,
        price : price ,
    })

    res.json({
        message : "Course updated" ,
        courseId : course._id
    })
});


adminRouter.get("/course/bulk" , adminMiddleware ,async function(req,res){
    const adminId = req.userId;

    
    const courses = await CoursesModel.find( {
        creatorId : adminId
    });

    res.json({
        courses
    })
});


module.exports = {
    adminRouter : adminRouter
}
