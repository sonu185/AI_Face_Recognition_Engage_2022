const mongoose = require('mongoose')

const attendenceCodeSchema = new mongoose.Schema({
    subject : {
        type : String,
        required : true
    },
    code : {
        type : String,
        length : 8,
        required : true,
        unique : true,
        index : true
    },
    validity : {
        type : Number
    },
    expiresAt : {
        type : Date,
        required : true
    }
}, {timestamps : true})

module.exports = mongoose.model('AttendenceCode', attendenceCodeSchema, 'AttendenceCode')