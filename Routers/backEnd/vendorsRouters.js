const { showVendorController, addVendors_controller_get, addVendoer_controller_post, editVendors_controller_get, editVendors_controller_post, chang_actvity_vendoer_controller, delete_vendor } = require("../../Controller/backEnd/vendor_controller");
const { uploade_img_multi_fild } = require("../../Helper/helper");
const router = require("express").Router();
const { isAuthonticate } = require("../../middel_ware/backEnd/isAuthonticate");
const {VendoerValidation} = require("../../validations/backEnd/VendoerValidation")




router.get("/" , isAuthonticate ,  showVendorController);
router.get("/addVendoer" , isAuthonticate ,  addVendors_controller_get);
router.post("/addVendoer" , isAuthonticate ,  uploade_img_multi_fild([
    {
        name : "image",
    },
    {
        name : "CommercialRegister",
    },
], "public/admin/asset/images/vindoer_image") , VendoerValidation() ,  addVendoer_controller_post);
router.get("/editVendor/:id" , isAuthonticate ,  editVendors_controller_get);
router.post("/editVendor/:id" , isAuthonticate ,  uploade_img_multi_fild([
    {
        name : "image",
    },
    {
        name : "CommercialRegister",
    },
], "public/admin/asset/images/vindoer_image") , VendoerValidation() ,  editVendors_controller_post);
router.get("/activety/:id" , isAuthonticate ,  chang_actvity_vendoer_controller);
router.get("/deleteVendor/:id" , isAuthonticate ,  delete_vendor);










module.exports = {
    vendorRouters : router
}