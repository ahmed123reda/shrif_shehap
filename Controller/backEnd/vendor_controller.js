const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const { tryError, handel_validation_errors, removeImgFiled , Rename_uploade_img_multiFild , returnWithMessage, removeImg} = require("../../Helper/helper");
const db = require("../../models");
const bcrypt = require("bcrypt")


/*------------------------- start signUp front End vendor -------------------------------*/
const addVendoer_controller_get = async (req , res , next) => {
    try {
        res.render("frontEnd/auth/vendor/signUp", {
            title : "signUp",
            validationError : req.flash("validationError")[0],
            notification : req.flash("notification")[0],

        })
    } catch (error) {
        tryError(res)
    }
}
/*------------------------- end signUp front End vendor -------------------------------*/



/*----------------------- start show vendors -------------------------*/
const showVendorController = async (req , res , next) => {
    try {
        var vendors = await db.vendor.findAll();
        res.render("backEnd/vendor/allVenderView" , {
            title : "All vendors",
            notification : req.flash("notification")[0],
            vendors : vendors,
            adminData : req.cookies.Admin
        })
    } catch (error) {
        tryError(res)
    }
}
/*----------------------- end show vendors -------------------------*/

/*----------------------- start add vendors -------------------------*/
const addVendors_controller_get = async (req , res , next) => {
    try {
        res.render("backEnd/vendor/addVendorView" , {
            title : "Add vendoer",
            notification : req.flash("notification")[0],
            validationError : req.flash("validationError")[0],
            adminData : req.cookies.Admin,
        })
    } catch (error) {
        tryError(res)
    }
}
/*----------------------- end add vendors -------------------------*/

/*------------------------- start add vendor post -------------------------------*/
const addVendoer_controller_post = async (req , res , next) => {
    try {
        console.log(validationResult(req).errors)
        var errors = validationResult(req).errors;
        if(errors.length > 0) {
            var url = ""
            if(req.url == "/addVendoer") {
                url = "addVendoer"
            } else {
                url = "signUp"
            }
            handel_validation_errors(req , res , errors , url);
            removeImgFiled([req.files.image , req.files.CommercialRegister])
            return
        }
        const files = Rename_uploade_img_multiFild([req.files.image , req.files.CommercialRegister]);
        var vendorData = req.body;
        await bcrypt.hash(vendorData.password , 10 , ((error , hash) => {
            vendorData.password = hash
            vendorData.image = files.image
            vendorData.CommercialRegister = files.CommercialRegister
            db.vendor.create(vendorData)
            var url = ""
            if(req.url == "/addVendoer") {
                url = "addVendoer"
            } else {
                url = "signUp"
            }
            returnWithMessage(req, res , url , "تم اضافتك كتاجر جديد يجب عليك تفعيل الحساب عن طريق الرساله التي تم ارسالها لك علي الجميل", "success")
        }))

    } catch (error) {
        tryError(res)
    }
}
/*------------------------- end add vendor post -------------------------------*/

/*----------------------- start edit catigorys -------------------------*/
const editVendors_controller_get = async (req , res , next) => {
    try {
        var vendor = await db.vendor.findOne({
            where : {
                id : {
                    [Op.eq] : req.params.id
                }
            }
        })
        res.render("backEnd/vendor/editVendorView" , {
            title : "Edit vendor",
            notification : req.flash("notification")[0],
            validationError : req.flash("validationError")[0],
            vendor : vendor,
            adminData : req.cookies.Admin
        })    
    } catch (error) {
        tryError(res , error)
    }
}
/*----------------------- end edit catigorys -------------------------*/

/*----------------------- start edit catigorys post -------------------------*/
const editVendors_controller_post = async (req , res , next) => {
    try {
        var errors = validationResult(req).errors;
        if(errors.length > 0) {
            var url = ""
            if(req.url == "/editCatigory/" + req.params.id) {
                url = "/admin/vendors/editCatigory/" + req.params.id
            } else {
                url = "" + req.params.id
            }
            handel_validation_errors(req , res , errors , url)
            removeImgFiled([req.files.image , req.files.CommercialRegister])
            return
        }
        var vendorData = req.body
        var files = Rename_uploade_img_multiFild([req.files.image , req.files.CommercialRegister]);

        await bcrypt.hash(vendorData.password , 10 , async (error , hash) => {
            var hashPassword = null
            if(vendorData.password) {
                hashPassword = hash
            } else {
                hashPassword = vendorData.hiddenPassword
            }
            vendorData.active = vendorData.active ? true : false
            if(files.image) {
                vendorData.image = files.image
                removeImg(req, "vindoer_image/" , vendorData.hiddenImage)
            }
            if(files.CommercialRegister){
                vendorData.CommercialRegister = files.CommercialRegister
                removeImg(req, "vindoer_image/" , vendorData.hiddenCommercialRegister)
            }

            if(hashPassword) vendorData.password = hashPassword
            await db.vendor.update(vendorData , {
                where : {
                    id : {
                        [Op.eq] : req.params.id
                    }
                }
            })
            if(req.url == "/editCatigory/" + req.params.id) {
                url = "/admin/vendors/editCatigory/" + req.params.id
            } else {
                url = "" + req.params.id
            }
            returnWithMessage(req , res , url , "تم تحديث البيانات بنجاح " , "success")
        })    
    } catch (error) {
        tryError(res , error)
    }
}
/*----------------------- end edit catigorys post -------------------------*/

/*----------------------- start delete catigorys -------------------------*/
const chang_actvity_vendoer_controller = async (req, res , next) => {
    try {
        var vendor = await db.vendor.findOne({
            where : {
                id : {
                    [Op.eq] : req.params.id
                }
            },
            attributes : [
                "active"
            ]
        })


        await db.vendor.update({
            active :  vendor.active ? false : true
        } , {
            where : {
                id : {
                    [Op.eq] : req.params.id
                }
            }
        })
        var message = vendor.active ? "تم الغاء التفعيل بنجاح" : "تم التفعيل بنجاح"
        returnWithMessage(req , res , "/admin/vendors/" , message , "success")
    } catch (error) {
        tryError(res , error)
    }
}
/*----------------------- end delete catigorys -------------------------*/

/*----------------------- start delete catigorys -------------------------*/
const delete_vendor = async (req, res , next) => {
    try {
        var vendor = await db.vendor.findOne({
            where : {
                id : {
                    [Op.eq] : req.params.id
                }
            },
            attributes : [
                "image",
                "CommercialRegister"
            ]
        })

        await db.vendor.destroy({
            where : {
                id : {
                    [Op.eq] : req.params.id
                }
            }
        })
        removeImg(req , "vindoer_image/" , vendor.image)
        removeImg(req , "vindoer_image/" , vendor.CommercialRegister)
        returnWithMessage(req , res , "/admin/vendors/" , "تم حذف التاجر بنجاح" , "success")
    } catch (error) {
        tryError(res , error)
    }
}
/*----------------------- end delete catigorys -------------------------*/








module.exports = {
    addVendoer_controller_get,
    showVendorController,
    addVendors_controller_get,
    addVendoer_controller_post,
    editVendors_controller_get,
    editVendors_controller_post,
    chang_actvity_vendoer_controller,
    delete_vendor
}