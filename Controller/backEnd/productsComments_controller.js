const { tryError } = require("../../Helper/helper")
const db = require("../../models")





/*-------------------- start show all products comments ----------------------------------*/
const showProductComments_Controller = async (req , res , next) => {
    try {
        var productComments = await db.productComments.scope("defaultLanguage").findAll()
        res.render("backEnd/productsComments/showLanguage_view" , {
            title : "all product comments",
            notification : req.flash("notification")[0],
            productComments : productComments,
            adminData : req.cookies.Admin
        })
    } catch (error) {
        tryError(res , error)
    }
}
/*-------------------- end show all products comments ----------------------------------*/

/*-------------------- start show all products comments ----------------------------------*/
const addProductComments_Controller_get = async (req , res , next) => {
    try {
        var products = await db.product.scope("defaultLanguage").findAll()
        res.render("backEnd/productsComments/addProductComments_view" , {
            title : "Add Product Comment",
            notification : req.flash("notification")[0],
            notification : req.flash("notification")[0],
            adminData : req.cookies.Admin,
            products : products,
            validationError : req.flash("validationError")[0],
        })
    } catch (error) {
        tryError(res , error)
    }
}
/*-------------------- end show all products comments ----------------------------------*/




module.exports = {
    showProductComments_Controller,
    addProductComments_Controller_get
}