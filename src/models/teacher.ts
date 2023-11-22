import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    middlename: {
        type: String
    },
    subject: {
        type: String
    },
    role: {
        type: String,
        default: 'Преподаватель'
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

export default mongoose.model('Teacher', teacherSchema);
