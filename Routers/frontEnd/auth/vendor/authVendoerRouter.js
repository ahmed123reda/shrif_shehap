const { addVendoer_controller_get, addVendoer_controller_post } = require("../../../../Controller/backEnd/vendor_controller");
const { uploade_img_multi_fild } = require("../../../../Helper/helper");
const { isAuthonticate } = require("../../../../middel_ware/backEnd/isAuthonticate");
const { VendoerValidation } = require("../../../../validations/backEnd/VendoerValidation");

var router = require("express").Router();



router.get("/signUp" , isAuthonticate , addVendoer_controller_get);
router.post("/signUp" , isAuthonticate , uploade_img_multi_fild([
    {
        name : "image",
    },
    {
        name : "CommercialRegister",
    },
], "public/admin/asset/images/vindoer_image") , VendoerValidation() , addVendoer_controller_post);







module.exports = {
    authVendorRouter : router
}