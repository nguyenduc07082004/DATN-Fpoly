import {Router} from 'express';
import {checkAuth} from '../middleware/checkAuth.js'
import { getInvoice, getInvoiceById , getInvoiceByOrderId } from '../controllers/InvoiceControllers.js';
const InvoiceRouter = Router();
InvoiceRouter.get('/',checkAuth,getInvoice) 
InvoiceRouter.get('/:id',checkAuth,getInvoiceById)
InvoiceRouter.get('/order/:orderId',getInvoiceByOrderId)
export default InvoiceRouter;
