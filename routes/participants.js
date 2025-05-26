const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Participant = require('../models/participant');
const { isLoggedIn } = require('../middleware')
// const participants = require('../controllers/participants')


router.get('/join', isLoggedIn, (req, res) => {
    res.render('participants/join')
})

router.post('/join', isLoggedIn, async (req, res) => {
    const newPar = new Participant(req.body);
    await newPar.save();
    req.flash('success', 'Successfully register tourment!')
    res.redirect(`/members/${newPar._id}`);
})

router.get('/members', isLoggedIn, async (req, res) => {
    const participants = await Participant.find({}).find({ $or: [{ race_result: { $exists: false } }, { race_result: null }], });
    // res.render('stages/index', { stages })
    res.render('participants/members', { participants })
})

router.get('/members/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const participant = await Participant.findById(id).populate('author');
    res.render('participants/info', { participant });
})

router.get('/members/:id/edit', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const participant = await Participant.findById(id);
    res.render('participants/edit', { participant });
})

router.put('/members/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const participant = await Participant.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    req.flash('success', 'Successfully Edit!')
    res.redirect(`/members/${participant._id}`)
})

router.delete('/members/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const deletedParticipants = await Participant.findByIdAndDelete(id);
    req.flash('success', 'Successfully delete!')
    res.redirect('/members');
})

router.get('/accepted', isLoggedIn, async (req, res) => {
    const acceptedPar = await Participant.find({ race_result: { $exists: true, $ne: null } }).sort({ race_result: 1 });
    res.render('participants/accepted', { acceptedPar })
})

router.post('/participants/accepted', isLoggedIn, async (req, res) => {
    const acceptedPar = new Participant(req.body);
    await acceptedPar.save();
    req.flash('success', 'Successfully accept')
    res.redirect(`/accepted`);
})


module.exports = router