import {Router} from 'express';
const CommentRouter = Router();
import {addCommentAndRating , getComments, getCommentsByProduct} from '../controllers/CommentControllers.js'

CommentRouter.post('/', addCommentAndRating);
CommentRouter.get('/:productId', getCommentsByProduct);
CommentRouter.get('/',getComments)
export default CommentRouter;
