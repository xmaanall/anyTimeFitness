const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    mobile: {
        type: Number,
        required: true,
    },

    //relations
    classes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class'
    }],
    membership: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Membership'
    }],
},
    {
        timestamps: true // means createdAt and updatedAt
    });


// VerifyPassword
userSchema.methods.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}


const User = mongoose.model("User", userSchema);

module.exports = User;