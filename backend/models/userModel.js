import mongoose from 'mongoose'; // 👈 1. Đổi require thành import (và thêm dấu =)

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please add a password']
    },
},
{
    timestamps: true
});

export default mongoose.model('User', userSchema); // 👈 2. Đổi module.exports thành export default