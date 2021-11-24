const { validationResult } = require("express-validator")
const { tryError, handel_validation_errors, removeImg, uploade_img, Rename_uploade_img, returnWithMessage } = require("../../../Helper/helper")
const fs = require("fs")
const bcrypt = require("bcrypt")
const db = require("../../../models")
const { sendEmail } = require("../../../emails/sendEmails")

/*----------------------------------- start signIn controller -----------------------------*/
const signUp_controller_get = async (req , res , next) => {
    try {
        res.render("frontEnd/auth/signUp" , {
            title : "signUp",
            validationError : req.flash("validationError")[0],
            notification : req.flash("notification")[0]
        })
    } catch (error) {
        tryError(res)
    }
}
/*----------------------------------- end signIn controller ------------------------------*/

/*----------------------------------- start signIn controller -----------------------------*/
const signUp_controller_post = async (req , res , next) => {
    try {
        var errors = validationResult(req).errors;
        if(errors.length > 0) {
            handel_validation_errors(req , res , errors , "signUp")
            if(req.file) {
                if(fs.existsSync(req.file.destination + "/"  + req.file.filename)) {
                    removeImg(req , req.file.filename)
                }
            }
            return ""
        }
        var image =  Rename_uploade_img(req)
        var user_data = req.body;
        console.log(user_data.password)
        bcrypt.hash(user_data.password , 10 , function (error , hash) {
            user_data.password = hash;
            user_data.isAdmin = false
            user_data.isVendor = false
            user_data.image = image ? image : null
            db.users.create(user_data);   
            returnWithMessage(req , res , "signUp" , "تم تسجيلك كمستخدم جديد للتفاعل في الموقع تم ارسال رساله تاكيد في الموقع" , "primary")
            sendEmail(user_data.email , user_data.fName , user_data.lName)     
        });


    } catch (error) {
        tryError(res, error)
    }
}
/*----------------------------------- end signIn controller ------------------------------*/









module.exports = {
    signUp_controller_get,
    signUp_controller_post
}