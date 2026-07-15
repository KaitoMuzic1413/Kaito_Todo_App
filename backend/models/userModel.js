import mongoose from 'mongoose';

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
    passwordSalt: {
        type: String,
        required: true,
    },
},
{
    timestamps: true
});

export default mongoose.model('User', userSchema);