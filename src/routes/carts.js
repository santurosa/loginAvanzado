import { Router } from "express";
import Carts from "../dao/db/carts.js";

const router = Router();
const cartsManager = new Carts();

router.get("/:cid", async (req, res) => {
    try {
        const cid = req.params.cid;

        const result = await cartsManager.getCart(cid);
        res.send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error });
    }
})

router.post("/", async (req, res) => {
    try {
        const result = await cartsManager.createCart();
        res.send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error });
    }
})

router.put("/:cid/product/:pid", async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;

        const result = await cartsManager.upgrateCart(cid, pid);
        res.send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error });
    }
})

router.put("/:cid", async (req, res) => {
    try {
        const cid = req.params.cid;
        const products = req.body;

        const result = await cartsManager.upgrateCartByBody(cid, products);
        res.send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error });
    }
})

router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const { quantity } = req.body

        if (!quantity) {
            res.status(422).send({ status: "error", message: "No se ha recibido quantity para actualizar" });
        } else {
            const result = await cartsManager.updateQuantityProducts(cid, pid, quantity);
            res.send({ status: "success", payload: result });
        }
    } catch (error) {
        res.status(500).send({ status: "error", error });
    }
})

router.delete("/:cid", async (req, res) => {
    try {
        const cid = req.params.cid;

        const result = await cartsManager.deleteCart(cid);
        res.send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error });
    }
})

router.delete("/:cid/product/:pid", async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;

        const result = await cartsManager.deleteProductToCart(cid, pid);
        res.send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error });
    }
})

export default router;