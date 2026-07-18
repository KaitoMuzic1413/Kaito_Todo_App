const taskSchema = mongoose.Schema(
    {
        text: {
            type: String,
            required: [true, 'Please add a task value'],
        }
    },
    { timestamps: true }
);