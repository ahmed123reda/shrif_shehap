const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const { tryError, handel_validation_errors, uploade_img, Rename_uploade_img, returnWithMessage, removeImg , removeImgFiled, Rename_uploade_img_multiFild, defaultLanguage, get_another_language } = require("../../Helper/helper");
const db = require("../../models");




/*----------------------- start show catigorys -------------------------*/
const showCatigorys_controller = async (req , res , next) => {
    try {
        var allcatigorys = await db.catigorys.scope("defaultLanguage" , "allCatigory").findAll();
        res.render("backEnd/catigorys/showCatigory_view" , {
            title : "All catigorys",
            notification : req.flash("notification")[0],
            allcatigorys : allcatigorys,
            adminData : req.cookies.Admin
        })
    } catch (error) {
        tryError(res)
    }
}
/*----------------------- end add catigorys -------------------------*/

/*----------------------- start add catigorys -------------------------*/
const addCatigorys_controller_get = async (req , res , next) => {
    try {
        res.render("backEnd/catigorys/addCatigory_view" , {
            title : "Add catigorys",
            notification : req.flash("notification")[0],
            validationError : req.flash("validationError")[0],
            adminData : req.cookies.Admin,
            activeLanguage : await db.language.scope("allLanguageActive").findAll()
        })
    } catch (error) {
        tryError(res)
    }
}
/*----------------------- end add catigorys -------------------------*/

/*----------------------- start add catigorys post -------------------------*/
const addCatigorys_controller_post = async (req , res , next) => {
    try {
        var errors = validationResult(req).errors
        if(errors.length > 0) {
            handel_validation_errors(req , res , errors , "addcatigory");
            removeImgFiled([req.files.image , req.files.slug])
            return
        }
        var fields_img = Rename_uploade_img_multiFild([req.files.image , req.files.slug])
        var catigory = req.body.catigors;
        catigory.forEach(element => {
            if(element.shourtcut == defaultLanguage()) {
                element.transitionOf = 0
                element.slug = fields_img.slug ? fields_img.slug : ""
                element.image = fields_img.image
                element.catigoryId = 0
                element.comments = element.comments ? true : false
                element.interAction = element.interAction ? true : false
                element.forShow = element.forShow ? true : false
                element.active = element.active ? true : false
                db.catigorys.create(element).then(result => {
                    catigory.forEach(elem => {
                        if(elem.shourtcut != defaultLanguage()) {
                            elem.transitionOf = result.id
                            elem.slug = fields_img.slug ? fields_img.slug : ""
                            elem.image = fields_img.image
                            elem.catigoryId = 0
                            elem.comments = elem.comments ? true : false
                            elem.interAction = elem.interAction ? true : false
                            elem.forShow = elem.forShow ? true : false
                            element.active = element.active ? true : false
                            db.catigorys.create(elem)
                        }
                    })
                    returnWithMessage(req , res , "addcatigory" , "تم اضافه قسم رءيسي جديد", "success") 
                })
            }
        });
    } catch (error) {
        tryError(res, error)
    }
}
/*----------------------- end add catigorys post -------------------------*/


/*----------------------- start edit catigorys -------------------------*/
const editCatigorys_controller_get = async (req , res , next) => {
    try {
        var catigorys_data_Full_lang = await (await get_another_language("catigorys" , req.params.id)).languages
        var setLangugaes = await (await get_another_language("catigorys" , req.params.id)).setLangugaes
        var catigorys_data = await db.catigorys.findByPk(req.params.id)

        res.render("backEnd/catigorys/editcatigory_view" , {
            title : "Edit catigorys",
            notification : req.flash("notification")[0],
            validationError : req.flash("validationError")[0],
            catigorys_data : catigorys_data,
            catigorys_data_Full_lang : catigorys_data_Full_lang,
            setLangugaes : setLangugaes,
            adminData : req.cookies.Admin
        })    
    } catch (error) {
        tryError(res , error)
    }
}
/*----------------------- end edit catigorys -------------------------*/

/*----------------------- start edit catigorys post -------------------------*/
const editCatigorys_controller_post = async (req , res , next) => {
    try {
        var errors = validationResult(req).errors;
        console.log(errors)
        if(errors.length > 0) {
            handel_validation_errors(req , res , errors , "/admin/catigors/editCatigory/" + req.params.id)
            removeImgFiled([req.files.image , req.files.slug])
            return
        } 
        var catigorsPhotos = await Rename_uploade_img_multiFild([req.files.image , req.files.slug]);
        if(catigorsPhotos.slug) { 
            removeImg(req , "categoris_photo/" , req.body.slug)
        }
        if(catigorsPhotos.image){
            removeImg(req , "categoris_photo/" , req.body.image)
        } 
        await req.body.catigors.forEach(async (element , i) => {
            if(!isNaN(element.id)) {
                var catigoryData = element;
                catigorsPhotos.image ? catigoryData.image = catigorsPhotos.image : null;
                catigorsPhotos.slug ? catigoryData.slug = catigorsPhotos.slug : null;
                await db.catigorys.update(catigoryData , {
                    where : {
                        id : {
                            [Op.eq] : element.id
                        }
                    }
                })
            } else {
                await db.catigorys.findOne({
                    where : {
                        id : {
                            [Op.eq] : req.body.catigors[0].id
                        }
                    }
                }).then(async (result) => {
                    if(result.transitionOf == 0) {
                        var transitionOf = result.id
                    } else {
                        var transitionOf = result.transitionOf
                    }
                    var addedCategory = {};
                    addedCategory.name = element.name
                    addedCategory.description = element.name
                    addedCategory.transitionOf = transitionOf
                    addedCategory.shourtcut = element.shourtcut 
                    addedCategory.image = result.image 
                    addedCategory.slug = result.slug 
                    addedCategory.catigoryId = result.catigoryId
                    addedCategory.active = element.active ? element.active : false
                    addedCategory.interAction = element.interAction ? element.interAction : false
                    addedCategory.forShow = element.forShow ? element.forShow : false
                    addedCategory.comments = element.comments ? element.comments : false
                    await db.catigorys.create(addedCategory)
                })
            }
            if(i == req.body.catigors.length - 1) {
                returnWithMessage(req , res , "/admin/catigors/editCatigory/" + req.params.id , "تم تعديل القسم بنجاح", "success")
            }
        });

        return
    } catch (error) {
        tryError(res , error)
    }
}
/*----------------------- end edit catigorys post -------------------------*/

/*----------------------- start delete catigorys -------------------------*/
const deleteCatigorys_controller = async (req, res , next) => {
    try {
        var catigorysLanguages = await (await get_another_language("catigorys" , req.params.id)).languages
        await db.catigorys.destroy({
            where : {
                id : req.params.id
            }
        })
        await catigorysLanguages.forEach((element) => {
            db.catigorys.destroy({
                where : {
                    id : element.id
                }
            })
        });

        removeImg(req , "categoris_photo/" , req.body.image)
        if(req.body.slug) removeImg(req , "categoris_photo/" , req.body.slug)
        returnWithMessage(req , res , "/admin/catigors/" , "تم حذف القسم بنجاح" , "danger")
    } catch (error) {
        tryError(res , error)
    }
}
/*----------------------- end delete catigorys -------------------------*/

/*----------------------- start active catigorys -------------------------*/
const active_Catigorys_controller = async (req, res , next) => {
    try {
        await db.catigorys.findOne({
            where : {
                id : {
                    [Op.eq] : req.params.id
                }
            } 
        }).then(async(resalt) => {
            await db.catigorys.update({
                active : resalt.active ? false : true
            } , {
                where : {
                    id : req.params.id
                }
        })
            var message  = resalt.active ? "تم الغاء التفعيل بنجاح" : "تم النفعيل بنجاح"
            returnWithMessage(req , res , "/admin/catigors/" , message , "success")
        })
    } catch (error) {
        tryError(res , error)
    }
}
/*----------------------- end active catigorys -------------------------*/








module.exports = {
    showCatigorys_controller,
    addCatigorys_controller_get,
    addCatigorys_controller_post,
    editCatigorys_controller_get,
    editCatigorys_controller_post,
    deleteCatigorys_controller,
    active_Catigorys_controller
}