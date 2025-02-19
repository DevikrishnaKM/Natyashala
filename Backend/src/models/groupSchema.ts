import mongoose from 'mongoose';
import { IGroup, IMessage } from '../interfaces/common.inteface';


const messageSchema = new mongoose.Schema<IMessage>({
  userId: { type: String, required: true }, 
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  courseId: { type: String, required: true }, 
  deleted : {type : Boolean, default : false}
});

const groupSchema = new mongoose.Schema<IGroup>({
  courseId: {
    type: String, 
    required: true,
  },
  messages: [messageSchema], 
  createdAt: { type: Date, default: Date.now },
});

const Group = mongoose.model('Group', groupSchema );


export default Group ;
export const Message = mongoose.model<IMessage>('Message', messageSchema);