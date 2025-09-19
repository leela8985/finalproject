import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  roll: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  studentType: {
    type: String,
    enum: ['Regular', 'Supplementary'], // Add 'Supplementary' as valid option
    required: true
  },
  subjects: [{
    subjectCode: String,
    subjectName: String,
    internal: Number,
    grade: String,
    credits: Number,
    status: {
      type: String,
      enum: ['Pass', 'Fail']
    }
  }]
});

// Function to get model for specific semester
export function getStudentModel(semester) {
    const collectionName = `semester_${semester.replace('-', '_')}`;
    return mongoose.models[collectionName] || mongoose.model(collectionName, studentSchema);
}

// Export the base Student model for general queries
export const Student = mongoose.model('Student', studentSchema);

// Export the schema for reference
export default studentSchema;