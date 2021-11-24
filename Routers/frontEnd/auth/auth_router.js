const { signUp_controller_get, signUp_controller_post } = require("../../../Controller/frontEnd/auth/auth_controller");
const { uploade_img } = require("../../../Helper/helper");
const { login_validation } = require("../../../validations/frontEnd/auth_validation");

var router = require("express").Router();



router.get("/signUp" , signUp_controller_get)
router.post("/signUp" , uploade_img("public/admin/asset/images/users_photo" , "image") , login_validation() , signUp_controller_post)








module.exports = {
    auth_front_router : router
}