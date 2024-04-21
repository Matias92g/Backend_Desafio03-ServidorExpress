import { promises as fs, constants } from "node:fs";

const PATH = "./productos.json";

async function ensureFileExists() {
  try {
    await fs.access(PATH, constants.F_OK);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(PATH, '[]');
    } else {
      throw error;
    }
  }
}
async function readProducts() {
  try {
    const fileContent = await fs.readFile(PATH, "utf-8", null,2);
    return JSON.parse(fileContent);
  } catch (error) {
    return [];
  }
}
async function writeProducts(products) {
  await fs.writeFile(PATH, JSON.stringify(products));
}
export default class ProductManager {
  constructor() {
    this.products = [];
  }
  async initialize() {
    await ensureFileExists();
    this.products = await readProducts();
  }
  async addProduct(product) {
    try {
      const prodById = this.products.find((prod) => prod.id === product.id);
      if (prodById) {
        console.log(`El producto ya existe ${prodById.title}`);
        prodById.stock += product.stock;
        await writeProducts(this.products);
        console.log(`Cantidad actualizada para ${prodById.title}. Nuevo stock: ${prodById.stock}`);
      } else {
        this.products.push(product);
        await writeProducts(this.products);
        console.log(`Producto agregado exitosamente: ${product.title}`);
      }
    } catch (error) {
      if (error.code === "ENOENT") {
        console.log(`El archivo ${PATH} no existe. Creando archivo y agregando el producto ${product.title}`
        );
        await writeProducts([product]);
        console.log(`Se ha creado el archivo ${PATH} y se agregó el producto ${product.title}`);
      } else { console.log("Error", error); }
    }
  }

  async deleteProd(id) {
    const prodById = this.products.find((prod) => prod.id === id);

    if (prodById) {
      await writeProducts(this.products.filter((prod) => prod.id !== id));

      console.log(
        `El producto ${prodById.title} con el id ${id} fue eliminado correctamente`
      );
    } else {
      console.log("Producto no encontrado");
    }
  }
  async updateProd(id, product) {
    const index = this.products.findIndex((prod) => prod.id === id);
    if (index !== -1) {
      this.products[index].title = product.title;
      this.products[index].description = product.description;
      this.products[index].price = product.price;
      this.products[index].code = product.code;
      this.products[index].stock = product.stock;
      await writeProducts(this.products);
    } else {
      console.log("Product not found");
    }
  }
  async getProducts() {
    this.products = await readProducts();
    return this.products;
  }
  async getProdById(id) {
    const prodById = this.products.find((prod) => prod.id === id);
    prodById ? console.log(prodById) : console.log("Producto no encontrado");
  }
}
