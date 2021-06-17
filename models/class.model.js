
const mongoose = require('mongoose');

const classSchema = mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    img: {
        type: String,
    },
    classImg: {
        type: Buffer,
    },
    classImgType: {
        type: String,
    },
    description: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },


    //relations
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member'
    }],
    Manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
},
    {
        timestamps: true // means createdAt and updatedAt
    });

classSchema.virtual('classImagePath').get(function () {
    if (this.classImg != null && this.classImgType != null) {
        return `data:${this.classImgType};charset=utf-8;base64,${this.classImg.toString('base64')}`
    }
})
const Class = mongoose.model("Class", classSchema);

module.exports = Class;