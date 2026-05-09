const mongoose = require("mongoose")

const projectSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    category: {
    type: String,
    required: true
    },

    link: {
    type: String,
    default: ""
    },

    image: {
        type: String,
        required: true
    },

    likes: {
        type: Number,
        default: 0
    },

    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },

    adminMessage: {
        type: String,
        default: ""
    },

    studentId: {
        type: String,
        required: true
    }

}, { timestamps: true })

module.exports = mongoose.model("Project", projectSchema)