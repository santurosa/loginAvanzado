import fs from "fs";

let products = [];

class ProductManager {

    constructor(title, description, price, thumbnail, stock) {
        this.id = (products.length + 1).toString();
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.stock = stock;

        this.path = "./Productos.json";
    }

    addProduct(title, description, price, thumbnail, stock) {
        const newProduct = new ProductManager(title, description, price, thumbnail, stock);
        products.push(newProduct);
        console.log(`Se ha agregado el producto "${title}" correctamente con el ID ${newProduct.id}`);
    }

    getProducts() {
        console.log(products);
    }

    getProductById(id) {
        const prod = products.find(product => product.id === id);
        prod ? console.log(`El producto cargado con el ID ${id} es:`, prod) : console.error(`Not found. No existe un producto con el ID ${id}`);
    }

    updateProduct(id, updatedProduct) {
        const productIndex = products.findIndex(product => product.id === id);
        if (productIndex !== -1) {
            const updatedProductWithId = { ...updatedProduct, id };
            products[productIndex] = updatedProductWithId;
            this.saveProductsToFile();
            console.log(`El producto con ID ${id} ha sido actualizado correctamente.`);
        } else {
            console.error(`No se encontró un producto con el ID ${id}. No se pudo actualizar.`);
        }
    }

    deleteProduct(id) {
        const productIndex = products.findIndex(product => product.id === id);
        if (productIndex !== -1) {
            products.splice(productIndex, 1);
            this.saveProductsToFile();
            console.log(`El producto con ID ${id} ha sido eliminado correctamente.`);
        } else {
            console.error(`No se encontró un producto con el ID ${id}. No se pudo eliminar.`);
        }
    }

    saveProductsToFile() {
        fs.writeFileSync(this.path, JSON.stringify(products, null, 2));
    }
}

const manejadorDeProductos = new ProductManager();

manejadorDeProductos.getProducts();

manejadorDeProductos.addProduct("Leche", "Leche de 500 ml deslactosada", 600, "./img/leche.jpg", 543);
manejadorDeProductos.addProduct("Yogur Natural", "Yogur natural sin azúcar añadido", 250, "./img/yogur.jpg", 387);
manejadorDeProductos.addProduct("Leche", "Leche de 500 ml deslactosada", 600, "./img/leche.jpg", 543);
manejadorDeProductos.addProduct("Manzanas", "Manzanas frescas y jugosas", 1.5, "./img/manzanas.jpg", 801);
manejadorDeProductos.addProduct("Pan Integral", "Pan integral recién horneado", 2, "./img/pan_integral.jpg", 802);
manejadorDeProductos.addProduct("Queso Parmesano", "Queso parmesano envejecido de alta calidad", 8, "./img/queso_parmesano.jpg", 803);
manejadorDeProductos.addProduct("Salmón", "Filete de salmón fresco de la costa atlántica", 12, "./img/salmon.jpg", 804);
manejadorDeProductos.addProduct("Aguacates", "Aguacates maduros listos para disfrutar", 2.5, "./img/aguacates.jpg", 805);
manejadorDeProductos.addProduct("Chocolate Amargo", "Tableta de chocolate amargo 70% cacao", 3.5, "./img/chocolate.jpg", 806);
manejadorDeProductos.addProduct("Especias Variadas", "Set de especias gourmet para sazonar tus platos", 15, "./img/especias.jpg", 807);

manejadorDeProductos.getProductById("1");
manejadorDeProductos.getProductById("26");

manejadorDeProductos.getProducts();