import express from "express";
const router = express.Router()
import {signup,login, logout} from "../controllers/authn.js"
import {imageupload} from "../Middleware/imageuplod.js"
import {addProduct, searchProducts, getProducts, getProduct, deleteProduct, updateProduct} from "../controllers/product_manage.js"
import {isAuthenticate} from "../Middleware/authz.js"

router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)
router.post("/addProduct",isAuthenticate,imageupload,addProduct)
router.get("/products/search",searchProducts)
router.get("/products",getProducts)
router.get("/product/:id",getProduct)
router.delete("/product/:id",isAuthenticate,deleteProduct)
router.put("/product/:id",isAuthenticate,imageupload,updateProduct)

router.get("/isAuth",isAuthenticate,(req,res) => {
    res.status(200).json({
        isAuth : true,
        message:"user is authenticated"
    })
})


export default router;