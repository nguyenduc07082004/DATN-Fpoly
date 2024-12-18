import {Router} from 'express';
import {getDeletedItems , restoreItem} from '../controllers/TrashControllers.js'
const TrashRouter = Router();

TrashRouter.get('/', getDeletedItems)
TrashRouter.put('/restore/:type/:id', restoreItem);
export default TrashRouter;
