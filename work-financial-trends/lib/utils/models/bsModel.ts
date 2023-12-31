import { model, Schema, Document, models } from 'mongoose';

export interface IBS extends Document {
    username: string,
    date: string,
    fWE: Number,
    sWE: Number,
    return: Number,
    openingBalance: Number,
    closingBalance: Number,
    weeklySpent: Number,
    weeklySave: Number
}

const BalanceSheet = new Schema<IBS> ({
    username: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    fWE: {
        type: Number,
        required: true
    },
    sWE: {
        type: Number,
        required: true
    },
    return: {
        type: Number
    },
    openingBalance: {
        type: Number,
        required: true
    },
    closingBalance: {
        type: Number,
        required: true
    },
    weeklySpent: {
        type: Number
    },
    weeklySave: {
        type: Number
    }
});

export default models.BS || model<IBS>('BS', BalanceSheet)