const { Router } = require("express");
const adminRouter = Router();
const { AdminModel , PurchaseModel, CoursesModel } = require("../db"); 


//auth
const jwt = require("jsonwebtoken");
const { default: z } = require("zod");

const { JWT_ADMIN_PASSWORD } = require("../config");
const { adminMiddleware } = require("../middlewares/admin");
const course = require("./course");

//bcrypt , zod , jsonwebtoken



// adminRouter.use(adminMiddleware);

adminRouter.post("/signup" , async function(req, res){
    // const { email , password , firstName , lastName } = req.body;
    // //ADD ZOD VALIDATION
    // //HASHPASSWORD , NOP PLAINTEXT PASSWORD TO BE STORED IN DB
    // email = z.string().email();

    // password = z.string().password();

    const { email , password , firstName , lastName } = req.body;
        //ADD ZOD VALIDATION
        //HASHPASSWORD , NOP PLAINTEXT PASSWORD TO BE STORED IN DB
        //put inside try catch block
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
    
        //todo : ideally password should be hashed and hence you cant compare the user provided password and the database password 
        const admin = await AdminModel.findOne({ //either the user or undefined
            email : email,
            password : password
        }); //[] if find -> still valid therfore error
    
    
        if(admin){
            const tokken = jwt.sign({
                id:user._id
            } , JWT_ADMIN_PASSWORD);
    
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


adminRouter.post("/course" , adminMiddleware , async function(req,res){
    const adminId = req.adminId;

    const {title , description , imageUrl , price } = req.body;


    //go through video : creating a web3 saas in 6hrs
    //how to build a pipeling for user to upload images as well
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
    //we must be sure that the courseid sent actually belongs to that person

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


    //go through video : creating a web3 saas in 6hrs
    //how to build a pipeling for user to upload images as well
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