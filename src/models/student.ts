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
    courseNumber: {
        type: Number,
        required: true
    },
    specialty: {
        type: String,
        required: true
    },
    scholarship: {
        type: String,
        required: true
    },
    formOfTraining: {
        type: String,
        required: true
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
        default: 'Student'
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
