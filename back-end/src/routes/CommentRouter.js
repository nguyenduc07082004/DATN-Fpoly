import {Router} from 'express';
const CommentRouter = Router();
import {addCommentAndRating , getComments, getCommentsByProduct , getCommentsWithReplies,deleteComment , getCommentById} from '../controllers/CommentControllers.js'

CommentRouter.post('/', addCommentAndRating);
CommentRouter.get('/:productId', getCommentsByProduct);
CommentRouter.get('/',getComments)
CommentRouter.get('/detail/:commentId', getCommentById);
CommentRouter.get('/replies/:productId', getCommentsWithReplies)
CommentRouter.delete('/:id', deleteComment)
export default CommentRouter;
