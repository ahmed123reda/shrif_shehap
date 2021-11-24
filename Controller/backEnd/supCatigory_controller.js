const { validationResult } = require("express-validator")
const { Op } = require("sequelize")
const { tryError, handel_validation_errors, removeImgFiled, Rename_uploade_img_multiFild, defaultLanguage, returnWithMessage, get_another_language, removeImg } = require("../../Helper/helper")
const db = require("../../models")



/*-------------------------------- start show all --------------------------------*/
const show_supCatigory_controller = async (req , res , next) => {
    try {
        var allSupCatigory = await db.catigorys.scope("allSupCatigory" , "defaultLanguage").findAll()
        res.render("backEnd/supCatigorys/showSupCatigory_view" , {
            title : "All Sup Catigory",
            notification : req.flash("notification")[0],
            allSupCatigory : allSupCatigory,
            adminData : req.cookies.Admin
        })
    } catch (error) {
        tryError(res , error)
    }
}
/*-------------------------------- end show all --------------------------------*/

/*-------------------------------- start add supCatigory --------------------------------*/
const add_supCatigory_controller_get = async (req , res , next) => {
    try {
        var activeLanuage = await db.language.scope("allLanguageActive").findAll()
        var catigorys = await db.catigorys.scope("allCatigory" , "defaultLanguage").findAll()
        res.render("backEnd/supCatigorys/addSupCatigory_view" , {
            title : "Add Sup Catigory",
            notification : req.flash("notification")[0],
            adminData : req.cookies.Admin,
            validationError : req.flash("validationError")[0],
            activeLanuage : activeLanuage,
            catigorys : catigorys
        })
    } catch (error) {
        tryError(res)
    }
}
/*-------------------------------- end add supCatigory --------------------------------*/

/*-------------------------------- start add supCatigory --------------------------------*/
const add_supCatigory_controller_post = async (req , res , next) => {
    try {
        var supCatigoryData = req.body.catigors;
        var files = Rename_uploade_img_multiFild([req.files.image , req.files.slug])
        var lastElementInCatigoryId = req.body.mainCatigory[req.body.mainCatigory.length - 1]
        var catigoryId = req.body.mainCatigory.length == 1 ? req.body.mainCatigory[0] : (lastElementInCatigoryId ? lastElementInCatigoryId :  req.body.mainCatigory[req.body.mainCatigory.length - 2])
        var x = await get_another_language("catigorys" , catigoryId)
        if(!await checkLang(x , supCatigoryData , catigoryId , req , res)) {
            return 
        }
        const errors = validationResult(req).errors
        if(errors.length > 0) {
            handel_validation_errors(req , res , errors , "addSupCatigory")
            removeImgFiled([req.files.image , req.files.slug])
            return
        }
        supCatigoryData.forEach(async (element) => {
            if(element.shourtcut == defaultLanguage()) {
                element.image = files.image
                element.slug = files.slug ? files.slug : null
                element.active = element.active ? true : false
                element.comments = element.comments ? true : false
                element.interAction = element.interAction ? true : false
                element.forShow = element.forShow ? true : false
                element.catigoryId = catigoryId
                element.transitionOf = 0
                await db.catigorys.create(element).then( result => {
                    supCatigoryData.forEach(async (element , i) => {
                        if(element.shourtcut != defaultLanguage()) {
                            element.image = files.image
                            element.slug = files.slug ? files.slug : null
                            element.active = element.active ? true : false
                            element.comments = element.comments ? true : false
                            element.interAction = element.interAction ? true : false
                            element.forShow = element.forShow ? true : false
                            var x = await (await get_another_language("catigorys" , catigoryId)).languages
                            x.forEach(ele => {
                                if(element.shourtcut == ele.shourtcut) {
                                    element.catigoryId = ele.id
                                }
                            });
                            
                            element.transitionOf = result.id
                            db.catigorys.create(element)
                        }
                        if(supCatigoryData.length - 1 == i) {
                            returnWithMessage(req , res , "addSupCatigory" , "تم اضافه قسم فرعي جديد" , "success")
                        }
                    });
                })
            }
        });
    } catch (error) {
        tryError(res)
    }
}
/*-------------------------------- end add supCatigory --------------------------------*/
/*-------------------------------- start add supCatigory --------------------------------*/
const edit_supCatigory_controller_get = async (req , res , next) => {
    try {
        var supCatigory = await db.catigorys.findOne({
            where : {
                id : {
                    [Op.eq] : req.params.id
                }
            }
        })
        var supCatigory_allLanguage = await (await get_another_language("catigorys" , req.params.id)).languages;
        var supCatigory_setLangugaes = await (await get_another_language("catigorys" , req.params.id)).setLangugaes;
        var catigorys = await db.catigorys.scope("defaultLanguage" , "allCatigory").findAll()
        res.render("backEnd/supCatigorys/editSupCatigory_view" , {
            title : "edit supcatigory",
            supCatigory : supCatigory,
            supCatigory_allLanguage : supCatigory_allLanguage,
            notification : req.flash("notification")[0],
            adminData : req.cookies.Admin,
            validationError : req.flash("validationError")[0],
            supCatigory_setLangugaes : supCatigory_setLangugaes,
            catigorys : catigorys
        })
    } catch (error) {
        tryError(res)
    }
}
/*-------------------------------- end add supCatigory --------------------------------*/

/*-------------------------------- start add supCatigory --------------------------------*/
const edit_supCatigory_controller_post = async (req , res , next) => {
    try {
        const errors = validationResult(req).errors
        if(errors.length > 0) {
            handel_validation_errors(req , res , errors , "/admin/supCatigory/edit_supCatigory/" + req.params.id)
            removeImgFiled([req.files.image , req.files.slug])
            return
        }
        var supCatigoryData = req.body.catigors;
        var files = Rename_uploade_img_multiFild([req.files.image , req.files.slug])
        var lastElementInCatigoryId = req.body.mainCatigory[req.body.mainCatigory.length - 1]
        var catigoryId = req.body.mainCatigory[0] == "" ? req.body.oldMainCatigory : (req.body.mainCatigory.length == 1 ? req.body.mainCatigory[0] : (lastElementInCatigoryId ? lastElementInCatigoryId : req.body.mainCatigory[req.body.mainCatigory.length - 2]))
        var x = await get_another_language("catigorys" , catigoryId)
        var y = await get_another_language("catigorys" , req.params.id)
        if(!await checkLang(x , supCatigoryData , catigoryId , req , res)) {
            return 
        }
        if(files.image) {
            removeImg(req , "subCatigory_photo/" , req.body.image)
        }
        if(files.slug) {
            if(req.body.slug) removeImg(req , "subCatigory_photo/" , req.body.slug)
        }
        supCatigoryData.forEach(async (element , i) => {
            if(element.shourtcut == defaultLanguage()) {
                element.image = files.image ? files.image : req.body.image
                element.slug = files.slug ? files.slug : req.body.slug
                element.active = element.active ? true : false
                element.comments = element.comments ? true : false
                element.interAction = element.interAction ? true : false
                element.forShow = element.forShow ? true : false
                element.catigoryId = catigoryId
                await db.catigorys.update(element , {
                    where : {
                        id : element.id
                    }
                })
            } else {
                if(!y.setLangugaes.includes(element.shourtcut)) {
                    element.image = files.image ? files.image : req.body.image
                    element.slug = files.slug ? files.slug : req.body.slug
                    element.active = element.active ? true : false
                    element.comments = element.comments ? true : false
                    element.interAction = element.interAction ? true : false
                    element.forShow = element.forShow ? true : false
                    x.languages.forEach(ele => {
                        if(element.shourtcut == ele.shourtcut) {
                            element.catigoryId = ele.id
                        }
                    });
                    await db.catigorys.update(element , {
                        where : {
                            id : {
                                [Op.eq] : element.id
                            }
                        }
                    })
                } else {
                    element.image = files.image ? files.image : req.body.image
                    element.slug = files.slug ? files.slug : req.body.slug
                    element.active = element.active ? true : false
                    element.comments = element.comments ? true : false
                    element.interAction = element.interAction ? true : false
                    element.forShow = element.forShow ? true : false
                    var transitionOf = await db.catigorys.findOne({
                        where : {
                            id : supCatigoryData[0].id
                        }
                    })
                    element.transitionOf = transitionOf.transitionOf == 0 ? transitionOf.id : transitionOf.transitionOf
                    await x.languages.forEach(ele => {
                        if(element.shourtcut == ele.shourtcut) {
                            element.catigoryId = ele.id
                        }
                    });
                    await db.catigorys.create(element)
                }
            }
            if(supCatigoryData.length - 1 == i) {
                returnWithMessage(req , res , "/admin/supCatigory/edit_supCatigory/" + req.params.id , "تم تعديل القسم بنجاح" , "success")
            }
        });
    } catch (error) {
        tryError(res , error)
    }
}
/*-------------------------------- end add supCatigory --------------------------------*/


/*-------------------------------- start delete supCatigory --------------------------------*/
const delete_supcatigory = async(req , res , next) => {
    try {
        var supCatigorysLanguages = await (await get_another_language("catigorys" , req.params.id)).languages
        await db.catigorys.destroy({
            where : {
                id : req.params.id
            }
        })
        await supCatigorysLanguages.forEach((element) => {
            db.catigorys.destroy({
                where : {
                    id : element.id
                }
            })
        });

        removeImg(req , "subCatigory_photo/" , req.body.image)
        if(req.body.slug) removeImg(req , "subCatigory_photo/" , req.body.slug)
        returnWithMessage(req , res , "/admin/supCatigory/" , "تم حذف القسم بنجاح" , "danger")
    } catch (error) {
        tryError(res , error)
    }
}
/*-------------------------------- end delete supCatigory --------------------------------*/

/*-------------------------------- start get_main_catigory_ajax --------------------------------*/
const get_main_catigory_ajax = async (req , res , next) => {
    try {
        var catigorys = await db.catigorys.findAll({
            where : {
                [Op.and] : [
                    {catigoryId : {[Op.eq] : req.params.id}},
                    {id : {[Op.ne] : req.params.id2} }
                ]
            }
        })
        res.send({catigorys})
    } catch (error) {
        tryError(res)
    }
}
/*-------------------------------- end get_main_catigory_ajax --------------------------------*/



async function checkLang(x , supCatigoryData , catigoryId , req , res) {
var arr = []
    var test = true
    x.languages.forEach(ele => {
        arr.push(ele.shourtcut)
    })
    supCatigoryData.forEach(async ele1 => {
        if(!arr.includes(ele1.shourtcut) && ele1.shourtcut != defaultLanguage()) {
            test = false
        }
    })
    if(!test) {
        await db.catigorys.findOne({
            where : {
                id : catigoryId
            }
        }).then(result => {
            if(result.catigoryId == 0) {
                returnWithMessage(req, res , "/admin/catigors/editCatigory/" + catigoryId , "يجب ادخال القسم بكل اللغات" , "danger")
            } else {
                returnWithMessage(req, res , "/admin/supCatigory/edit_supCatigory/" + catigoryId , "يجب ادخال القسم الفرعي هذا بكل اللغات" , "danger")
            }
        })
        return false
    }
    return true
}












module.exports = {
    show_supCatigory_controller,
    add_supCatigory_controller_get,
    add_supCatigory_controller_post,
    get_main_catigory_ajax,
    edit_supCatigory_controller_get,
    edit_supCatigory_controller_post,
    delete_supcatigory
}