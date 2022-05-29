const Attendence = require("../models/Attendence");
const catchErrors = require("../utils/catchErrors");
const User = require('../models/User')
const { successResponse, errorResponse } = require("../utils/response");
const { isCodeValid, isAttendenceMarked, getDateString } = require("../utils/AttendenceUtils");


exports.getFaceRecognitionLabels = catchErrors(async (req, res) => {
    const info = await User.find({ role: { $ne: 'ADMIN' } }).select('name images')
    res.status(200).json(successResponse('success', info))
})

exports.validateAtFirstStep = catchErrors(async (req, res) => {
    const { attCode } = req.body
    const validCode = await isCodeValid(attCode)
    if (!validCode) return res.status(400).json(errorResponse('Attendence Code is invalid or is Expired'))

    const markedAlready = await isAttendenceMarked(req.user._id, validCode._id)
    if (markedAlready) return res.status(400).json(errorResponse('You have already marked your Attendence'))

    res.status(200).json(successResponse('success'))
})

exports.markAttendence = catchErrors(async (req, res) => {
    const { attCode } = req.body
    const validCode = await isCodeValid(attCode)
    console.log({validCode})
    if (!validCode) return res.status(400).json(errorResponse('Attendence Code is Expired'))
    const markedAlready = await isAttendenceMarked(req.user._id)
    if (markedAlready) return res.status(400).json(errorResponse('You have already marked your Attendence'))

    const dateString = getDateString()

    const att = new Attendence({
        attCode : validCode.data._id,
        student: req.user._id,
        dateString,
        status: 'present'
    })

    const savedAtt = await att.save()
    res.status(200).json(successResponse("success", savedAtt))
})

exports.getMyAttendence = catchErrors(async (req, res) => {
    const attHistory = await Attendence.find({ student: req.user._id })
        .populate('attCode')
        .populate('student')
        .sort({createdAt : 'desc'})

    res.status(200).json(successResponse('success', attHistory))
})

