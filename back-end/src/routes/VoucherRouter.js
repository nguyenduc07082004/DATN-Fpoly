import { Router } from "express";

const VoucherRouter = Router();

import {
    getAllVouchers,getVoucherByCode,
    createVoucher,
    updateVoucher,
    deleteVoucher,
    useVoucher,
    checkVoucher,
    getVoucherUsed
} from "../controllers/VoucherControllers.js";

VoucherRouter.get("/", getAllVouchers);
VoucherRouter.get("/user", getVoucherUsed);
VoucherRouter.get("/:code",getVoucherByCode );
VoucherRouter.post("/", createVoucher);
VoucherRouter.post("/use", useVoucher);
VoucherRouter.post("/check", checkVoucher);
VoucherRouter.put("/:id", updateVoucher);
VoucherRouter.delete("/:id", deleteVoucher);

export default VoucherRouter;