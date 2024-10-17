const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const patientSchema = new Schema({
  guardian_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  patient_name: { 
    type: String, 
    required: true, 
  },
  date_of_birth: { 
    type: Date, 
    required: true, 
  },
  patient_sex: { 
    type: String, 
    required: true,
    enum: ['Male', 'Female', 'Other'], 
  },
  patient_age: { 
    type: Number, 
    required: true, 
  },
  physician_name: { 
    type: String, 
    required: true, 
  },
  diagnosis: String, 
  siblings: [{
    sibling_name: String,
    sibling_age: Number,
    sibling_sex: String,
  }],
  
  school_skills: {
    school_name: String,
    grade_level: String,
    problems_in_school_activities: Boolean,
    school_activities_desc: String,
    problems_with_academics: Boolean,
    academics_desc: String,
    focusing_school_problem: Boolean,
  },
  physical_tasks: {
    performing_physical_tasks: Boolean,
    physical_tasks_desc: String,
    complying_with_directives: Boolean,
    directives_desc: String,
    communicating_with_others: Boolean,
    communication_desc: String,
    taking_care_of_himself: Boolean,
    self_care_desc: String,
    interacting_with_others: Boolean,
    interaction_desc: String,
    feeding_problem: Boolean,
    dressing_problem: Boolean,
    walking_problem: Boolean,
    bathroom_problem: Boolean,
  },
  sle_concerns: {
    speech_concern: Boolean,
    concern_noticed_date: String, // Consider using Date type for actual date storage
  },
  sle_receptive_skills: {
    responds_to_name: Boolean,
    gets_common_objects: Boolean,
    follows_simple_directions: Boolean,
    points_to_pictures: Boolean,
    names_pictures: Boolean,
    asks_questions: Boolean,
    repeats_expressions: Boolean,
    repeats_questions_instead_of_answering: Boolean,
    excessively_recites_words: Boolean,
    said_word_then_stopped_using: Boolean,
    said_word_then_stopped_using_date: String, // Consider using Date type
    language_development_stopped: Boolean,
    language_development_stopped_date: String, // Consider using Date type
  },
  
  sle_motor_skills: {
    crawled_age: String, // Consider using Number type for age with a unit field (e.g., 'months')
    sat_alone_age: String, 
    walked_unaided_age: String, 
    fed_self_age: String, 
    dressed_self_age: String,
    toilet_trained_age: String, 
    cooing_age: String, 
    babbles: Boolean,
    babbling_age: String,
    said_first_word: Boolean,
    first_word_age: String, 
    first_word: String,
    can_understand_50: Boolean,
    understood_50_words_age: String,
    sample_understood_words: String,
    expressed_50: Boolean,
    expressed_50_words_age: String, 
    sample_expressed_words: String,
    fluent_words: Boolean,
    stuttering: Boolean,
    articulation_difficulty: Boolean,
    inconsistent_voice: Boolean,
  },
  therapy_types: [{ 
    type: String,
    enum: ['slp', 'ot'] 
  }], 
  active: { 
    type: Boolean, 
    default: true,
  },

  assignedLessons: [
    {
      lessonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson'
      },
      lesson_name: { 
        type: String,
      },
      lesson_complexity: { 
        type: String,
      },
      lesson_category: { 
        type: String,
      },
      lesson_desc: { 
        type: String,
      },
      assignedDate: {
        type: Date,
        default: Date.now
      },
      // ... other fields
    }
  ],

  created_at: { 
    type: Date, 
    default: Date.now, 
  },
  updated_at: { 
    type: Date, 
    default: Date.now, 
  },
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;