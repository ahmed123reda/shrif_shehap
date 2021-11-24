


/*--------------------------- start validation product ---------------------------*/

const { check } = require("express-validator")

const productValidation = () => {
    return [
        check("products[*][productName]").notEmpty().withMessage("يجب ادخال اسم المنتج ").isString().withMessage("هذا الحقل يستقبل نصا فقط"),
        check("pieces").notEmpty().withMessage("يجب ادخال عدد قطع المنتج ").isNumeric().withMessage("هذا الحقل يستقبل ارقام فقط"),
        check("products[*][ProductOverview]").notEmpty().withMessage("يجب ادخال لمحه سريعه عن المنتج ").isString().withMessage("هذا الحقل يستقبل نصا فقط"),
        check("products[*].fullDescription").notEmpty().withMessage("يجب ادخال وصف كامل عن المنتج وشرح دقيق "),
        check("products[*][keyWord]").notEmpty().withMessage("ادخل الكلمات المفتاحيه التي من خلالها يتم البحث عن المنتج"),
        check("price").notEmpty().withMessage("يجب ادخال سعر المنتج"),
        check("version").notEmpty().withMessage("يجب ادخال اصدار المنتج"),
        check("mainCatigory").custom((value , {req}) => {
            if(req.url == "/addProduct") {
                if(value.length == 1 && value[0] == "") {
                    throw new Error("")
                }
            }
            return true
        }).withMessage("يجب ادخال قسم المنتج"),
        check("productState").notEmpty().withMessage("يجب ادخال حالت المنتج اذا كان جديد او مستعمل"),
        check("dayesOfUsed").custom(async (value , {req}) => {
            if((req.body.productState == "0" && value == "") || (value == undefined && req.body.productState == "0")) {
                throw new Error("")
            }
            return true
        }).withMessage("يجب ادخال عدد ايام الاستعمال"),
        check("productImage").custom(async (value , {req}) => {
            if(!req.files.productImage && req.url == "/addProduct" ) {
                throw new Error("")
            }  
            return true
        }).withMessage("يجب ادخال علي الاقل صوره للقسم").custom(async (value , {req}) => {
            if(!req.files.productImage) return true
            req.files.productImage.forEach(element => {
                var arrayExtention = ["jpg" , "png" , "jpeg" , "gif" , "svg"];
                var originalname = element.originalname.split(".");
                var imgExtension = originalname[originalname.length - 1].toLowerCase();
                if(!arrayExtention.includes(imgExtension)) {
                    throw new Error("")
                }
            });
        }).withMessage(`يجب ان يكون امتداد الصور jpg , jpeg , png , gif , svg`).custom(async (value , {req}) => {
            if(!req.files.productImage) return true
            if(req.files.productImage.length > 3) {
                throw new Error("")
            }
        }).withMessage("يجب الا تزيد الصور عن 3 صور").custom(async (value , {req}) => {
            if(!req.files.productImage) return true
            req.files.productImage.forEach(element => {
                if(element.size > 200000) {
                    throw new Error("")
                }
            });
        }).withMessage("الصوره يجب الا تزيد عن 200000 kb"),
        check("descriptionImage").custom(async (value , {req}) => {
            if(!req.files.descriptionImage) return true
            req.files.descriptionImage.forEach(element => {
                var arrayExtention = ["jpg" , "png" , "jpeg" , "gif" , "svg"];
                var originalname = element.originalname.split(".");
                var imgExtension = originalname[originalname.length - 1].toLowerCase();
                if(!arrayExtention.includes(imgExtension)) {
                    throw new Error("")
                }
            });
        }).withMessage(`يجب ان يكون امتداد الصور jpg , jpeg , png , gif , svg`).custom(async (value , {req}) => {
            if(!req.files.descriptionImage) return true
            if(req.files.descriptionImage.length > 3) {
                throw new Error("")
            }
        }).custom(async (value , {req}) => {
            if(!req.files.descriptionImage) return true
            req.files.descriptionImage.forEach(element => {
                if(element.size > 200000) {
                    throw new Error("")
                }
            });
        }).withMessage("الصوره يجب الا تزيد عن 200000 kb"),
        check("productVideo").custom(async (value , {req}) => {
            if(!req.files.productVideo) return true
            req.files.productVideo.forEach(element => {
                var arrayExtention = ["dvd","avi" , "mkv" , "mv4" , "flv" , "wmv"];
                var originalname = element.originalname.split(".");
                var imgExtension = originalname[originalname.length - 1].toLowerCase();
                if(!arrayExtention.includes(imgExtension)) {
                    throw new Error("")
                }
            });
        }).withMessage(`يجب ان يكون امتداد الصور dvd , avi , mkv , mv4 , flv`),

    ]
}

/*--------------------------- end validation product ---------------------------*/












module.exports = {
    productValidation
}






















