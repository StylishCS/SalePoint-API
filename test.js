const express = require("express");
const easyinvoice = require("easyinvoice");
const fs = require("fs");
const path = require("path");

const app = express();

let imgPath = path.resolve("images", "invoice.png");
function base64_encode(file) {
  let png = fs.readFileSync(imgPath);
  return new Buffer.from(png).toString("base64");
}



let obj = [];
let discount = 100;
let total = 600 - discount;

let prods = [
  { name: "prod1", price: 100, quantity: 1 },
  { name: "prod2", price: 200, quantity: 2 },
  { name: "prod3", price: 300, quantity: 3 },
];

prods.forEach((prod) => {
  obj.push({
    description: prod.name,
    price: prod.price,
    quantity: prod.quantity,
    "tax-rate": 0,
  });
})


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
    company: `Customer Name: ${"Client Name"}`,
    "Customer Phone Number": `Customer Phone Number: ${"Client Phone Number"}`,
  },
  information: {
    number: `${"Invoice ID"}`,
    date: `${"Invoice Date"}`,
  },
  products: obj,
  "bottom-notice": "Happy Shopping!",
  settings: {
    currency: "EGP",
  },
  translate: {
    vat: "Discount",
  }
};

const invoicePdf = async ()=>{
    let result = await easyinvoice.createInvoice(data);
    fs.writeFileSync(`./invoice/invoice${Date.now()}.pdf`, result.pdf, 'base64');
}
invoicePdf();


app.listen(3000, () => {
  console.log("running");
});