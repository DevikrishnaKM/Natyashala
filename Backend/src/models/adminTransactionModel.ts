import mongoose, { Schema } from 'mongoose';
import { IAdminTransaction } from '../interfaces/common.inteface';



const adminTransactionSchema: Schema = new Schema<IAdminTransaction>({
  transactionId: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  course: {
    courseId: { type: String, required: true },
    courseName: { type: String, required: true },
    tutor: {
      tutorId: { type: String, required: true },
      tutorName: { type: String, required: true },
    },
  },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
});


const AdminTransaction = mongoose.model<IAdminTransaction>('AdminTransaction', adminTransactionSchema);

export default AdminTransaction;