import { Router } from "express";
import Products from "../dao/db/products.js";
import Carts from "../dao/db/carts.js";

const router = Router();
const productManager = new Products();
const cartsManager = new Carts();

const publicAccess = (req, res, next) => {
    if (req.session.user) return res.redirect("/products");
    next();
}

const privateAccess = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    next();
}

router.get("/login", publicAccess, (req, res)=> {
    res.render("login");
})

router.get("/register", publicAccess, (req, res)=> {
    res.render("register")
})

router.get("/products", privateAccess, async (req, res) => {
    const { limit = 10, page = 1 } = req.query;
    const user = req.session.user;
    const { products, hasPrevPage, hasNextPage, nextPage, prevPage } = await productManager.getProducts(limit, page);
    res.render("products", { products, hasPrevPage, hasNextPage, nextPage, prevPage, limit, user });
})

router.get("/carts/:cid", privateAccess, async (req, res) => {
    const cid = req.params.cid
    const cart = await cartsManager.getCart(cid);
    res.render("carts", {cart});
})

router.get("/chat", privateAccess, (req, res) => {
    res.render("chat", {});
})

export default router;