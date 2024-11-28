import {Router} from 'express';
const CommentRouter = Router();
import {addCommentAndRating , getComments, getCommentsByProduct , getCommentsWithReplies} from '../controllers/CommentControllers.js'

CommentRouter.post('/', addCommentAndRating);
CommentRouter.get('/:productId', getCommentsByProduct);
CommentRouter.get('/',getComments)
CommentRouter.get('/replies/:productId', getCommentsWithReplies)
export default CommentRouter;
