import fs from 'fs';
import { Router } from "express";

const router = Router();

const manejoJSON = async () => {
    try {
        const data = await fs.promises.readFile("src/products.json", "utf-8");
        const productos = JSON.parse(data);
        return productos;
    }
    catch (error) {
        throw new Error(error);
    }
}

const saveProductsToFile = async () => {
    await fs.promises.writeFile("src/products.json", JSON.stringify(products, null, 2));
}

const products = await manejoJSON();

router.get("/api/products", (req, res) => {
    let limit = req.query.limit;
    if (limit) {
        let limiteDeseado = +limit;
        const productosDeseados = (products).slice(0, limiteDeseado);
        res.send(productosDeseados);
    } else {
        res.send(products);
    }
})

router.get("/api/products/:pid", (req, res) => {
    const id = +req.params.pid;
    if (id > 0) {
        const searchProduct = products.filter(product => product.id === id)
        res.send(searchProduct);
    } else {
        return res.status(400).send({ status: 'error', error: 'Se debe colocar un id superior a 0' })
    }
})

router.post("/api/products", (req, res) => {
    const product = req.body;
    if (!product.title || !product.description || !product.code || !product.price || !product.stock || !product.category) {
        return res.status(400).send({ status: 'error', error: 'Valores incompletos' })
    }
    const maxId = products.reduce((max, product) => Math.max(max, product.id), 0);
    product.id = maxId + 1;
    product.status = !product.status ? true : product.status;
    product.thumbnails = !product.thumbnails ? ["Sin imagenes"] : product.thumbnails; 
    const productoAgregado = products.push(product);
    saveProductsToFile(productoAgregado)
    res.send({ status: 'success', message: products })
})

router.put("/api/products/:pid", (req, res) => {
    const id = +req.params.pid;
    const product = req.body;

    if(product.id){
        return res.status(400).send({ status: 'error', error: 'No esta permitido actualizar el id de un producto' })
    }

    const indexProduct = products.findIndex(product => product.id == id)

    product.id = products[indexProduct].id;
    products[indexProduct] = product;

    res.send(products[indexProduct]);
})

router.delete("/api/products/:pid", (req, res) => {
    const id = +req.params.pid;

    const deleteProducts = products.filter(product => product.id !== id)

    if (products.length === deleteProducts.length) {
        return res.status(400).send({ status: 'Error', mensaje: `No se encontro producto con el id ${id}` })
    }

    products = deleteProducts;

    res.send({ products });
})

export default router;