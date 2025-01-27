import { Document, Schema, model } from 'mongoose';
import { ITransaction, IWallet } from '../interfaces/common.inteface';

const transactionSchema = new Schema<ITransaction>({
  amount: { type: Number, required: true },
  transactionId : {type : String , required : true},
  transactionType: { type: String, enum: ['credit', 'course payment'], required: true },
  course: {type : String},
  date: { type: Date, default: Date.now },
});

const walletSchema = new Schema<IWallet>(
  {
    userId: { type: String, required: true },
    balance: { type: Number, required: true, default: 0 },
    transactions: [transactionSchema],
  },
  { timestamps: true }
);

export const Wallet = model<IWallet>('Wallet', walletSchema);