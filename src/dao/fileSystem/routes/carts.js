import fs from 'fs';
import { Router } from "express";

const router = Router();

const manejoJSON = async (path) => {
    try {
        const data = await fs.promises.readFile(path, "utf-8");
        const productos = JSON.parse(data);
        return productos;
    }
    catch (error) {
        throw new Error(error);
    }
}

const saveProductsToFile = async () => {
    await fs.promises.writeFile("src/carts.json", JSON.stringify(carts, null, 2));
}

const products = await manejoJSON("src/products.json");
const carts = await manejoJSON("src/carts.json");

router.get("api/carts/:cid", (req, res) => {
    const cartId = +req.params.cid;
    const cart = carts.find(cart => cart.id === cartId);
    
    if (!cart) {
        return res.status(404).send({ status: 'error', error: 'Carrito no encontrado' });
    }

    res.send(cart.products);
});

router.post("api/carts/:cid/product/:pid", (req, res) => {
    const cartId = +req.params.cid;
    const productId = +req.params.pid;
    const quantity = 1;

    const cart = carts.find(cart => cart.id === cartId);
    const product = products.find(product => product.id === productId);
    
    if (!product) {
        return res.status(404).send({ status: 'error', error: 'Producto no encontrado' });
    }

    if (!cart) {
        cart = {
            id: cartId,
            products: [productId],
            quantity: 1
        }

    }

    const existingProduct = cart.products.find(item => item.product === productId);

    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        const carritoAgregado = cart.products.push({ product: productId, quantity });
        saveProductsToFile(carritoAgregado);
    }

    res.send({ status: 'success', message: 'Producto agregado al carrito' });
});


export default router;