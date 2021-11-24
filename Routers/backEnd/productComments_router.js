const { showProductComments_Controller , addProductComments_Controller_get} = require("../../Controller/backEnd/productsComments_controller")
const { isAuthonticate } = require("../../middel_ware/backEnd/isAuthonticate")

const Router = require("express").Router()




Router.get("/" , isAuthonticate , showProductComments_Controller)
Router.get("/addProductComment" , isAuthonticate , addProductComments_Controller_get)







module.exports = {
    productCommentsRouter : Router
}