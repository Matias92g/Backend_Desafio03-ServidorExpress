import ProductManager from "./productManager.js"
import express from "express";
const app = express()
const PORT = 8080

const productManager = new ProductManager();

app.listen(8080, () => console.log('Server run on port', PORT))

app.get("/products", async (req, res) => {
    const { limit } = req.query;
    const products = await productManager.getProducts();
    if (!limit) {
        res.send(products);
    } else {
        const limitToInt = parseInt(limit);

        if (!isNaN(limitToInt) && limitToInt > 0) {
            const limitedProds = products.slice(0, limitToInt);
            res.send(limitedProds);
        } else {
            res.send({
                error: "Tipo de dato incorrecto",
            });
        }
    }
});
app.get("/products/:pid", async (req, res) => {
    const id  = req.params;
    const product = await productManager.getProdById(parseInt(id));
    if (!product) {
        res.send({ error: "No se ha encontrado el producto" });
    } else {
        res.send(
            `<body>
            <div>
              <ul>
                <li><span>Id:</span>${product.id}</li>
                <li><span>Title:</span>${product.title}</li>
                <li><span>Description:</span>${product.description}</li>
                <li><span>Price:</span>${product.price}</li>
                <li><span>Code:</span>${product.code}</li>
                <li><span>Stock:</span>${product.stock}</li>
              </ul>
            </div>
        </body>`
        );
    }
});
