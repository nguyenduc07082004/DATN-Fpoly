import Invoice from "../models/InvoiceModels.js";


export const getInvoice = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const skip = (page - 1) * pageSize;

        const invoices = await Invoice.find()
            .skip(skip)
            .limit(pageSize);

        const totalInvoices = await Invoice.countDocuments();

        const totalPages = Math.ceil(totalInvoices / pageSize);

        res.status(200).json({
            invoices,
            page,
            pageSize,
            totalPages,
            totalInvoices,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};


export const getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }
        res.status(200).json(invoice);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getInvoiceByOrderId = async (req, res) => {
    const {orderId} = req.params
    try {
        const invoice = await Invoice.findOne({ orderId: orderId });
        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }
        res.status(200).json(invoice);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};