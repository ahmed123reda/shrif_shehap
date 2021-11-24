const express = require("express");
const app = express()
const path = require("path");
const models = require("./models");
const session = require("express-session");
const flash = require("connect-flash")
const { dashporedRouter } = require("./Routers/backEnd/dashpored_router");
const { languageRouter } = require("./Routers/backEnd/language_Router");
const cookies = require("cookie-parser");
const { auth_front_router } = require("./Routers/frontEnd/auth/auth_router");
const { authRouter } = require("./Routers/backEnd/auth/auth_router");
const { catigorysRouter } = require("./Routers/backEnd/catigorys_router");
const { authVendorRouter } = require("./Routers/frontEnd/auth/vendor/authVendoerRouter");
const { vendorRouters } = require("./Routers/backEnd/vendorsRouters");
const { supCatigorysRouter } = require("./Routers/backEnd/supCatigory_router");
const { ProductsRouter } = require("./Routers/backEnd/product_router");
const { productCommentsRouter } = require("./Routers/backEnd/productComments_router");



/*--------------------------- start app.use ----------------------------------*/
app.use(express.urlencoded({extended : true}))
app.set("views" , path.join(__dirname , "views"))
app.set("view engine" , "ejs")
app.use(express.static(path.join(__dirname , 'public')))
app.use(cookies())
app.use(session({
    secret : "هذا الاوبشن خاص بالتشفير يطلب منك نص معين يستخدمه هو عند التشفير وكلما زاد هذا النص زاد الحمايه",
    saveUninitialized : false, // معناها انه عند عمل session لاتقوم بحفظها في الداتابيز الا عندما امرك بذالك
    /*cookie : { // السشن ده هو في الاصل عباره عن cookie لذالك انا اقوم بتحديد بعض القيم لتحديد مده الانتهاء الديفولت هو عند اغلاق المتصفح
        //maxAge : 1 * 60 * 60 * 100, 
    },*/
    resave : true    
}))
app.use(flash())
/*--------------------------- end app.use ----------------------------------*/


/*--------------------------- start router  ----------------------------------*/


/*--------------------------- backEnd routers  ----------------------------------*/
app.use("/admin" , authRouter)
app.use("/admin" , dashporedRouter)
app.use("/admin/language" , languageRouter)
app.use("/admin/catigors" , catigorysRouter)
app.use("/admin/vendors" , vendorRouters)
app.use("/admin/supCatigory" , supCatigorysRouter)
app.use("/admin/products" , ProductsRouter)
app.use("/admin/productComments" , productCommentsRouter)

/*--------------------------- backEnd routers  ----------------------------------*/

/*--------------------------- frontEnd routers  ----------------------------------*/



app.use("/" , auth_front_router)
app.use("/vendor" , authVendorRouter)

/*--------------------------- frontEnd routers  ----------------------------------*/


app.use((req , res , next) => {
    res.render("error" , {message : "this page not hir" , title : "Error Page"})
})
/*--------------------------- end route  ----------------------------------*/

app.listen(3000 , () => {
    console.log("app started")
})


