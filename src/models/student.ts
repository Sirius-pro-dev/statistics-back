import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
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
    groupNumber: {
        type: String,
        default: undefined
    },
    grades: {
        type: [Number],
        default: []
    },
    passList: {
        type: [String],
        default: []
    },
    role: {
        type: String,
        default: 'Студент'
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

export default mongoose.model('Student', studentSchema);