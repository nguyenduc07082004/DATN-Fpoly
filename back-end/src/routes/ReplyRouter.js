import {Router} from 'express';
const ReplyRouter = Router();
import {addReply , getCommentsWithReplies} from '../controllers/ReplyControllers.js'

ReplyRouter.post('/:commentId', addReply);
ReplyRouter.get('/',getCommentsWithReplies) 
export default ReplyRouter;
