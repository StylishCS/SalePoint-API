const {getInvoice, getInvoices} = require("../services/invoiceServices")
async function getAllInvoice(req,res){
    try {
        let invoices = await getInvoices();
        if(!invoices[0]){
            return res.status(404).json("NO DATA FOUND");
        }
        return res.status(200).json(invoices);
    } catch (error) {
        return res.status(500).json("INTERNAL SERVER ERROR");
    }
}

module.exports = { getAllInvoice };