const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    message: {type: String, required: true},
    timestamp: {type:Date, default: Date.now}
})

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;