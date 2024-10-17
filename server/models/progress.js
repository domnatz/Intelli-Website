const progressSchema = new mongoose.Schema({
    patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient', 
      required: true,
    },
    self_aware: { // Keep this field
      type: Boolean,
      required: true,
    },
    lesson_engagement: {
      type: String,
      required: true,
    },
    improvement_state: {
      type: String,
      required: true,
    },
    error_frequency: {
      type: String,
      required: true,
    },
    progress_quality: {
      type: String,
      required: true,
    },
    remarks: {
      type: String,
    },
    progress_score: {
      type: Number,
      required: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  });