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
      grades: {
        type: [Number],
        required: true
      }
})

export default mongoose.model('Student', studentSchema);