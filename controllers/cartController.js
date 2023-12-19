const { nanoid } = require("nanoid");
const {
  addProduct,
  getProductById,
  getProducts,
  updateProd,
  deleteProd,
} = require("../services/productServices");

const fs = require("fs");
const path = require("path");
const easyinvoice = require("easyinvoice");
const streamifier = require("streamifier");
const cloudinary = require("../utils/cloudinary");
const { pdf2pic } = require("pdf2pic");

const { createInvoice } = require("../services/cartServices");

async function checkout(req, res) {
  try {
    let totalSellPrice = 0;
    let totalNetPrice = 0;
    let profit = 0;
    let products = new Array();
    const promises = req.body.Cart.map(async (prod) => {
      let product = await getProductById(prod.Item1.Id);
      product[0].quantity = prod.Item2;
      products.push(product[0]);
      totalNetPrice += product[0].netPrice * product[0].quantity;
      totalSellPrice += product[0].sellPrice * product[0].quantity;
      await updateProd(product[0].id, { stock: product[0].stock - prod.Item2 });
    });
    await Promise.all(promises);
    totalSellPrice -= req.body.Details.Discount;
    profit = totalSellPrice - totalNetPrice;
    let details = {
      customerName: req.body.Details.CustomerName,
      customerPhone: req.body.Details.CustomerPhone,
      discount: req.body.Details.Discount,
      totalNetPrice: totalNetPrice,
      totalSellPrice: totalSellPrice,
      profit: profit,
      id: nanoid(10),
    };
    let obj = [];

    products.forEach((prod) => {
      obj.push({
        description: prod.name,
        price: prod.sellPrice,
        quantity: prod.quantity,
        "tax-rate": 0,
      });
    });
    let imgPath = path.resolve("images", "invoice.png");
    function base64_encode(file) {
      let png = fs.readFileSync(imgPath);
      return new Buffer.from(png).toString("base64");
    }
    let data = {
      images: {
        logo: `${base64_encode(imgPath)}`,
        background: "",
      },
      sender: {
        company: "Sale Of Point",
        address: "Cairo, Egypt",
        zip: "1234 AB",
        city: "Shorouk",
        country: "Egypt",
      },
      client: {
        company: `Customer Name: ${details.customerName}`,
        address: `Customer Phone Number: ${details.customerPhone}`,
      },
      information: {
        number: `${details.id}`,
        date: `${new Date()}`,
      },
      products: obj,
      "bottom-notice": "Happy Shopping!",
      settings: {
        currency: "EGP",
      },
      translate: {
        vat: "Discount",
        address: "Customer Phone Number: ",
      },
    };
    const invoicePdf = async () => {
      let result = await easyinvoice.createInvoice(data);
      fs.writeFileSync(
        `./public/${details.id}.pdf`,
        result.pdf,
        "base64"
      );
    };
    invoicePdf();
    await createInvoice(details, products);
    return res.status(200).send("ok");
  } catch (error) {
    console.log(error);
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

module.exports = { checkout };
