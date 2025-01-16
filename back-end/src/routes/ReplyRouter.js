import {Router} from 'express';
import {checkAuth} from '../middleware/checkAuth.js'
const ReplyRouter = Router();
import {addReply , getCommentsWithReplies , deleteReply} from '../controllers/ReplyControllers.js'

ReplyRouter.post('/:commentId', addReply);
ReplyRouter.get('/',getCommentsWithReplies) 
ReplyRouter.delete('/:id', checkAuth, deleteReply)
export default ReplyRouter;
