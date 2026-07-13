const taskSchema = mongoose.Schema(
    {
        // Tạm thời ẩn đoạn này đi để test cổng POST api/users trước đã
        /* user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        }, */
        text: {
            type: String,
            required: [true, 'Please add a task value'],
        }
    },
    { timestamps: true }
);