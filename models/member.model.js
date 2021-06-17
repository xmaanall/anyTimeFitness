const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const memberSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    profileImg: {
        type: Buffer,
    },
    profileImgType: {
        type: String,
    },
    height: {
        type: Number,
    },
    weight: {
        type: Number,
    },
    mobile: {
        type: Number,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
    },
    bDate: {
        type: Date,
    },
    address: {
        type: String,
    },
    gender: {
        type: String,
    },

    //relations
    classes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class'
    }],
    membership: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Membership'
    },
},

    {
        timestamps: true // means createdAt and updatedAt
    });


// VerifyPassword
memberSchema.methods.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}



memberSchema.virtual('coverImagePath').get(function () {
    if (this.profileImg != null && this.profileImgType != null) {
        return `data:${this.profileImgType};charset=utf-8;base64,${this.profileImg.toString('base64')}`
    }
})

const Member = mongoose.model("Member", memberSchema);

module.exports = Member;