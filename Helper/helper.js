/*--************ start helpper functions --**********/

const multer = require("multer")
const fs = require("fs")
const db = require("../models")
const { Op } = require("sequelize");


/*----------------- start try error -------------------*/
const tryError = async (res , message = null) => {
    message = message ? message : "هناك خطا ما في الاتصال ويجب عليك مراجعه مبرمج الموقع",
    res.render("error" , {message : message})
}
/*----------------- end try error -------------------*/



/*----------------- start return with message -------------------*/
const returnWithMessage = async (req , res , url = "", message = "" , type = "" ) => {
    message = message ? message : "هناك خطا ما ويرجي التحقق من الكود",
    type = type ? type : "danger",
    req.flash("notification" , {message : message , type : type})
    res.redirect(url)
}
/*----------------- end return with message -------------------*/


/*------------------------------------ start getDate -------------------------------*/
function getDate(time , type = "") {
    var date = time.toString().split(" ");
    if(!type) {
        date = date[1] + " " + date[2] + " " + date[3] + " " + date[4] + " "
    } else if(type == "time") {
        date =  date[4] + " "
    } else {
        date = date[1] + " " + date[2]  + " " + date[3] 
    }

    return date
}
/*------------------------------------ end getDate -------------------------------*/


/*------------------------------------ start handel validation errors -------------------------------*/
var handel_validation_errors = (req , res,errors , path) => {
    var param = [];
    var newError = {}
    errors.forEach(element => {
        if(!param.includes(element.param)) {
            param.push(element.param)
            newError[element.param] = [element]
        } else {
            newError[element.param].push(element)
        }
    });
    req.flash("validationError" , newError)
    res.redirect(path)
}
/*------------------------------------ end handel validation errors -------------------------------*/

/*------------------------------------ start uploade image -------------------------------*/
const uploade_img = (path , image) => {
   return multer({dest : path}).array(image)
}
const uploade_img_multi_fild = (array , dest) => {
   return multer({dest : dest}).fields(array)
}
/*--------------------------------------------------*/

const Rename_uploade_img_multiFild = (fields) => {
    var fileds_img = {};
    var image = ""
    fields.forEach(element => {
        if(element) {
            element.forEach((element ,i) => {
                var randomNumber = Math.random(1000 , 9000);
                var newPath = element.destination + "/" + randomNumber + element.originalname;
                fs.renameSync(element.path , newPath)
                image += randomNumber + element.originalname + "--"
            });
            fileds_img[element[0].fieldname] = image
            image = ""
        }
    });
    return fileds_img
    
}
/*--------------------------------------------------*/

/*--------------------------------------------------*/

const Rename_uploade_img = (req ) => {
    var image = ""
    req.files.forEach(element => {
        var randomNumber = Math.random(1000 , 9000);
        var newPath = element.destination + "/" + randomNumber + element.originalname;
        fs.renameSync(element.path , newPath)
        image += randomNumber + element.originalname + "--"
    });
    return image
}
/*--------------------------------------------------*/

const removeImgFiled = (fields) => {
    fields.forEach(element => {
        if(element) {
            element.forEach((element ,i) => {
                fs.unlinkSync(element.path)
            });
        }
    });
}
/*--------------------------------------------------*/


/*--------------------------------------------------*/

const removeImg = (req , folder , imgname = "") => {
    if(!imgname) {
        req.files.forEach(element => {
            fs.unlinkSync(element.path)
        });
    } else {
        var imgname = imgname.split("--")
        for(var i = 0 ; i < imgname.length - 1 ; i++) {
            console.log(imgname[i])
            fs.unlinkSync("public/admin/asset/images/" + folder + imgname[i])
        }
    }
}
/*------------------------------------ end uploade image -------------------------------*/


/*------------------------------------ get default Language -------------------------------*/
const defaultLanguage = () => {
    return "ar"
}
/*------------------------------------ get default Language -------------------------------*/

/*------------------------------------ get_another_language -------------------------------*/
const get_another_language = async function(table , id) {
    const db = require("../models")
    var allLanguageShourtcut = []
    var language = await db.catigorys.findOne({
        where : {
            id : id
        }
    })
    allLanguageShourtcut.push(language.shourtcut)


    if(language.transitionOf == 0) {
        var languages = await db[table].findAll({
            where : {
                transitionOf : language.id
            }
        })
        await languages.forEach(element => {
            allLanguageShourtcut.push(element.shourtcut)
        });
        var setLangugaes = await GetAddedLanguage(allLanguageShourtcut)
        return {languages , setLangugaes}
    } else {
        const languages = await db[table].findAll({
            where : {
                [Op.or] : [{id : language.transitionOf} , { transitionOf : language.transitionOf}],
                id : {
                    [Op.not] : language.id
                }
            }
        })
        await languages.forEach(element => {
            allLanguageShourtcut.push(element.shourtcut)
        });
        var setLangugaes = await GetAddedLanguage(allLanguageShourtcut)
        return {languages , setLangugaes}
    }
}
/*------------------------------------ if i add another language -------------------------------*/
const GetAddedLanguage = async (arr) => {
    const db = require("../models")
    var setLangugaes = []
    var allLanguageActive = await db.language.scope("allLanguageActive").findAll();
    allLanguageActive.forEach(element => {
        if(!arr.includes(element.shourtcut)) {
            setLangugaes.push(element.shourtcut)
        }
    });
    return setLangugaes
}
/*------------------------------------ if i add another language -------------------------------*/
/*------------------------------------ get_another_language -------------------------------*/



















/*--------------------- start check deletedlanguage ---------------------*/
const checkDeletedlanguage = (shourtcut) => {
    const db = require("../models")
    var language = db.deletedLanguage.findOne({
        where : {
            shourtcut : shourtcut
        }
    })
    if(language) {
        db.deletedLanguage.destroy({
            where : {
                shourtcut : shourtcut
            }
        })    
    }
}
/*--------------------- end check deletedlanguage ---------------------*/


/*--------------------- start count of tabels ---------------------*/


/*--------------------- end count of tabels ---------------------*/
























module.exports = {
    returnWithMessage,
    getDate,
    tryError,
    handel_validation_errors,
    uploade_img,
    Rename_uploade_img,
    removeImg,
    checkDeletedlanguage,
    uploade_img_multi_fild,
    Rename_uploade_img_multiFild,
    removeImgFiled,
    defaultLanguage,
    get_another_language,
}