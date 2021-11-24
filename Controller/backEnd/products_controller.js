const { validationResult } = require("express-validator")
const { Op } = require("sequelize")
const { tryError, handel_validation_errors, removeImgFiled, Rename_uploade_img_multiFild, defaultLanguage, returnWithMessage, get_another_language, removeImg, inputsTags } = require("../../Helper/helper")
const db = require("../../models")



/*-------------------------------- start show all --------------------------------*/
const show_products_controller = async (req , res , next) => {
    try {
        var allProducts = await db.product.scope("defaultLanguage").findAll()
        res.render("backEnd/products/showProduct_view" , {
            title : "All Products",
            notification : req.flash("notification")[0],
            allProducts : allProducts,
            adminData : req.cookies.Admin
        })
    } catch (error) {
        tryError(res , error)
    }
}
/*-------------------------------- end show all --------------------------------*/

/*-------------------------------- start add products --------------------------------*/
const add_product_controller_get = async (req , res , next) => {
    try {
        var activeLanuage = await db.language.scope("allLanguageActive").findAll()
        var catigorys = await db.catigorys.scope("allCatigory" , "defaultLanguage").findAll()
        res.render("backEnd/products/addProduct_view" , {
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
/*-------------------------------- end add products --------------------------------*/

/*-------------------------------- start add products --------------------------------*/
const add_product_controller_post = async (req , res , next) => {
    try {
        var products = req.body.products;
        var files = Rename_uploade_img_multiFild([req.files.productImage , req.files.descriptionImage , req.files.productVideo])
        var lastElementInMainCatigoryId = req.body.mainCatigory[req.body.mainCatigory.length - 1]
        var catigoryId = req.body.mainCatigory.length == 1 ? req.body.mainCatigory[0] : (lastElementInMainCatigoryId ? lastElementInMainCatigoryId :  req.body.mainCatigory[req.body.mainCatigory.length - 2])
        var x = await get_another_language("catigorys" , catigoryId)
        if(!await checkLang(x , products , catigoryId , req , res)) {
            console.log("dddsss")
            return 
        }
        const errors = validationResult(req).errors
        if(errors.length > 0) {
            handel_validation_errors(req , res , errors , "addProduct")
            removeImgFiled([req.files.productImage , req.files.descriptionImage , req.files.productVideo])
            return
        }
        products.forEach(async (element) => {
            if(element.shourtcut == defaultLanguage()) {
                element.productImage = files.productImage
                element.descriptionImage = files.descriptionImage ? files.descriptionImage : null
                element.productVideo = files.productVideo ? files.productVideo : null
                element.active = req.body.active ? true : false
                element.comments = req.body.comments ? true : false
                element.interAction = req.body.interAction ? true : false
                element.likes = req.body.likes ? true : false
                element.catigory = catigoryId
                element.price = req.body.price
                element.pieces = req.body.pieces
                element.version = req.body.version
                element.descount = req.body.descount !== "0" && req.body.descount ? req.body.descount : null
                element.transitionOf = 0
                element.productState = req.body.productState == "0" ? (req.body.dayesOfUsed > 0 ? false : true) : true
                element.dayesOfUsed = req.body.dayesOfUsed != "0" && req.body.dayesOfUsed ? req.body.dayesOfUsed : null
                await db.product.create(element).then( result => {
                    products.forEach(async (element , i) => {
                        if(element.shourtcut != defaultLanguage()) {
                            element.productImage = files.productImage
                            element.descriptionImage = files.descriptionImage ? files.descriptionImage : null
                            element.productVideo = files.productVideo ? files.productVideo : null
                            element.active = req.body.active ? true : false
                            element.comments = req.body.comments ? true : false
                            element.interAction = req.body.interAction ? true : false
                            element.likes = req.body.likes ? true : false
                            element.price = req.body.price
                            element.pieces = req.body.pieces
                            element.version = req.body.version
                            element.descount = req.body.descount !== "0" && req.body.descount ? req.body.descount : null
                            element.dayesOfUsed = req.body.dayesOfUsed != "0" && req.body.dayesOfUsed ? req.body.dayesOfUsed : null
                            var x = await (await get_another_language("catigorys" , catigoryId)).languages
                            x.forEach(ele => {
                                if(element.shourtcut == ele.shourtcut) {
                                    element.catigory = ele.id
                                }
                            });
                            element.productState = req.body.productState == "0" ? (req.body.dayesOfUsed > 0 ? false : true) : true
                            element.fullDescription = element.fullDescription
                            element.keyWord = element.keyWord
                            element.transitionOf = result.id
                            db.product.create(element)
                        }
                        if(products.length - 1 == i) {
                            returnWithMessage(req , res , "addProduct" , "تم اضافه منتج جديد بنجاح" , "success")
                        }
                    });
                })
            }
        });
    } catch (error) {
        tryError(res)
    }
}
/*-------------------------------- end add products --------------------------------*/
/*-------------------------------- start add products --------------------------------*/
const edit_products_controller_get = async (req , res , next) => {
    try {
        var product = await db.product.findOne({
            where : {
                id : {
                    [Op.eq] : req.params.id
                }
            }
        })
        var products_allLanguage = await (await get_another_language("product" , req.params.id)).languages;
        var products_setLangugaes = await (await get_another_language("product" , req.params.id)).setLangugaes;
        var catigorys = await db.catigorys.scope("defaultLanguage" , "allCatigory").findAll()
        res.render("backEnd/products/editProducts_view" , {
            title : "edit products",
            product : product,
            products_allLanguage : products_allLanguage,
            notification : req.flash("notification")[0],
            adminData : req.cookies.Admin,
            validationError : req.flash("validationError")[0],
            products_setLangugaes : products_setLangugaes,
            catigorys : catigorys
        })
    } catch (error) {
        tryError(res , error)
    }
}
/*-------------------------------- end add products --------------------------------*/

/*-------------------------------- start add products --------------------------------*/
const edit_products_controller_post = async (req , res , next) => {
    try {
        const errors = validationResult(req).errors
        if(errors.length > 0) {
            handel_validation_errors(req , res , errors , "/admin/products/edit_products/" + req.params.id)
            removeImgFiled([req.files.productImage , req.files.descriptionImage , req.files.productVideo])
            return
        }

        var productsData = req.body.products;
        var files = Rename_uploade_img_multiFild([req.files.productImage , req.files.descriptionImage , req.files.productVideo])
        if(files.productImage) {
            removeImg(req , "products_image/" , req.body.productImage)
        }
        if(files.descriptionImage) {
            if(req.body.descriptionImage) removeImg(req , "products_image/" , req.body.descriptionImage)
        }
        if(files.productVideo) {
            if(req.body.productVideo) removeImg(req , "products_image/" , req.body.productVideo)
        }

        var lastElementInMainCatigoryId = req.body.mainCatigory[req.body.mainCatigory.length - 1]
        var catigoryId = req.body.mainCatigory.length == 1 ? req.body.mainCatigory[0] : (lastElementInMainCatigoryId ? lastElementInMainCatigoryId : req.body.mainCatigory[req.body.mainCatigory.length - 2])
        var x = await get_another_language("catigorys" , catigoryId)
        var y = await get_another_language("product" , req.params.id)
        if(!await checkLang(x , productsData , catigoryId , req , res)) {
            return 
        }
        productsData.forEach(async (element , i) => {
            if(element.shourtcut == defaultLanguage()) {
                element.productImage = files.productImage ? files.productImage : req.body.productImage
                element.descriptionImage = files.descriptionImage ? files.descriptionImage : req.body.descriptionImage
                element.productVideo = files.productVideo ? files.productVideo : req.body.productVideo
                element.active = req.body.active ? true : false
                element.comments = req.body.comments ? true : false
                element.interAction = req.body.interAction ? true : false
                element.likes = req.body.likes ? true : false
                element.price = req.body.price
                element.pieces = req.body.pieces
                element.version = req.body.version
                element.descount = req.body.descount !== "0" && req.body.descount ? req.body.descount : null
                element.catigoryId = catigoryId
                element.dayesOfUsed = req.body.dayesOfUsed != "0" && req.body.dayesOfUsed ? req.body.dayesOfUsed : null
                element.productState = req.body.productState == "0" ? (req.body.dayesOfUsed > 0 ? false : true) : true
                await db.product.update(element , {
                    where : {
                        id : element.id
                    }
                })
            } else {
                if(!y.setLangugaes.includes(element.shourtcut)) {
                    element.productImage = files.productImage ? files.productImage : req.body.productImage
                    element.descriptionImage = files.descriptionImage ? files.descriptionImage : req.body.descriptionImage
                    element.productVideo = files.productVideo ? files.productVideo : req.body.productVideo
                    element.active = req.body.active ? true : false
                    element.comments = req.body.comments ? true : false
                    element.interAction = req.body.interAction ? true : false
                    element.likes = req.body.likes ? true : false
                    element.price = req.body.price
                    element.pieces = req.body.pieces
                    element.version = req.body.version
                    element.descount = req.body.descount !== "0" && req.body.descount ? req.body.descount : null
                    element.catigoryId = catigoryId
                    element.dayesOfUsed = req.body.dayesOfUsed != "0" && req.body.dayesOfUsed ? req.body.dayesOfUsed : null
                    element.productState = req.body.productState == "0" ? (req.body.dayesOfUsed > 0 ? false : true) : true
                    x.languages.forEach(ele => {
                        if(element.shourtcut == ele.shourtcut) {
                            element.catigoryId = ele.id
                        }
                    });
                    await db.product.update(element , {
                        where : {
                            id : {
                                [Op.eq] : element.id
                            }
                        }
                    })
                } else {
                    element.productImage = files.productImage ? files.productImage : req.body.productImage
                    element.descriptionImage = files.descriptionImage ? files.descriptionImage : req.body.descriptionImage
                    element.productVideo = files.productVideo ? files.productVideo : req.body.productVideo
                    element.active = req.body.active ? true : false
                    element.comments = req.body.comments ? true : false
                    element.interAction = req.body.interAction ? true : false
                    element.likes = req.body.likes ? true : false
                    element.price = req.body.price
                    element.pieces = req.body.pieces
                    element.version = req.body.version
                    element.descount = req.body.descount !== "0" && req.body.descount ? req.body.descount : null
                    element.dayesOfUsed = req.body.dayesOfUsed != "0" && req.body.dayesOfUsed ? req.body.dayesOfUsed : null
                    element.productState = req.body.productState == "0" ? (req.body.dayesOfUsed > 0 ? false : true) : true
                    var transitionOf = await db.product.findOne({
                        where : {
                            id : productsData[0].id
                        }
                    })
                    element.transitionOf = transitionOf.transitionOf == 0 ? transitionOf.id : transitionOf.transitionOf
                    await x.languages.forEach(ele => {
                        if(element.shourtcut == ele.shourtcut) {
                            element.catigory = ele.id
                        }
                    });                        
                    await db.product.create(element)
                }
            }
            if(productsData.length - 1 == i) {
                returnWithMessage(req , res , "/admin/products/edit_products/" + req.params.id , "تم تعديل القسم بنجاح" , "success")
            }
        });
    } catch (error) {
        tryError(res , error)
    }
}
/*-------------------------------- end add products --------------------------------*/


/*-------------------------------- start delete products --------------------------------*/
const delete_products = async(req , res , next) => {
    try {
        var productssLanguages = await (await get_another_language("catigorys" , req.params.id)).languages
        await db.catigorys.destroy({
            where : {
                id : req.params.id
            }
        })
        await productssLanguages.forEach((element) => {
            db.catigorys.destroy({
                where : {
                    id : element.id
                }
            })
        });

        removeImg(req , "subCatigory_photo/" , req.body.image)
        if(req.body.slug) removeImg(req , "subCatigory_photo/" , req.body.slug)
        returnWithMessage(req , res , "/admin/products/" , "تم حذف القسم بنجاح" , "danger")
    } catch (error) {
        tryError(res , error)
    }
}
/*-------------------------------- end delete products --------------------------------*/







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







const checkLang = async (x , supCatigoryData , catigoryId , req , res) => {
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
            console.log("ddd")
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
    show_products_controller,
    add_product_controller_get,
    add_product_controller_post,
    get_main_catigory_ajax,
    edit_products_controller_get,
    edit_products_controller_post,
    delete_products
}