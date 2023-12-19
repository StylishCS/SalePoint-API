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
    console.log(totalSellPrice);
    let details = {
      customerName: req.body.Details.CustomerName,
      customerPhone: req.body.Details.CustomerPhone,
      discount: req.body.Details.Discount,
      totalNetPrice: totalNetPrice,
      totalSellPrice: totalSellPrice,
      profit: profit,
      id: nanoid(10),
    };
    ///////////////////////////////////////////////////////////
    //console.log(products);
    let obj = [];

    products.forEach((prod) => {
      obj.push({
        description: prod.name,
        price: prod.sellPrice,
        quantity: prod.quantity,
        "tax-rate": 0,
      });
    });
    console.log(obj);
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
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async function convertPDFtoImage(pdfFilePath) {
      const options = {
        density: 100, // Output image density (DPI)
        saveFilename: "output", // Output file name (without extension)
        savePath: "./images/", // Output directory
        format: "png", // Output format (png, jpeg, etc.)
        width: 800, // Output width
        height: 600, // Output height
      };

      const pdfConverter = new pdf2pic(options);
      return pdfConverter.convert(pdfFilePath, 1); // Convert the first page of the PDF
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const invoicePdf = async () => {
      let result = await easyinvoice.createInvoice(data);
      let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
          let stream = cloudinary.uploader.upload_stream(
            {
              resource_type: "auto", // Specify resource type as "raw" for PDF
            },
            (error, result) => {
              if (result) {
                resolve(result);
              } else {
                reject(error);
              }
            }
          );
          streamifier.createReadStream(result.pdf).pipe(stream);
        });
      };
      let cloudResult = await streamUpload(req);
      let imageUrl = cloudinary.url(cloudResult.public_id);
      console.log(imageUrl);
      return imageUrl;
    };

    // const invoicePdf = async () => {
    //   let result = await easyinvoice.createInvoice(data);
    //   fs.writeFileSync(
    //     `./invoice/invoice${Date.now()}.pdf`,
    //     result.pdf,
    //     "base64"
    //   );
    // };
    invoicePdf()
      .then(async (url) => {
        //upload invoice to cloudinary
        details.invoiceView = url;
        let invoice = await createInvoice(details, products);
      })
      .catch((e) => {
        console.log(e);
      });
    ///////////////////////////////////////////////////////////
    return res.status(200).send("ok");
  } catch (error) {
    console.log(error);
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

module.exports = { checkout };
