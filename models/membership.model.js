
const mongoose = require('mongoose');

const membershipSchema = mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    duration: {
        type: String,
    },
    price: {
        type: Number,
    },
    limit: {
        type: Number,
    },


    //relations
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member'
    },
    Manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
},
    {
        timestamps: true // means createdAt and updatedAt
    });


const Membership = mongoose.model("Membership", membershipSchema);

module.exports = Membership;