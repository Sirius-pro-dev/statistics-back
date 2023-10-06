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
        required: true
    },
    grades: {
        type: [Number],
        required: true
    },
    passList: {
        type: [String],
        required: true
    }
})

export default mongoose.model('Student', studentSchema);