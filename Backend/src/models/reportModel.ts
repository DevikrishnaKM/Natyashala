import mongoose, { Document, Schema } from 'mongoose';
import { IReport } from '../interfaces/common.inteface';

const reportSchema: Schema<IReport> = new Schema({
  reportId: { type: String, required: true },
  courseId: { type: String, required: true },
  tutorName: { type: String, required: true },
  courseName: { type: String, required: true },
  reason: { type: String, required: true },
  additionalInfo: { type: String },
  status: { type: String, enum: ['pending', 'resolved'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Report = mongoose.model<IReport>('Report', reportSchema);

export default Report;