const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ParticipantSchema = new Schema({
    entry_number: Number,
    name: String,
    nationality: String,
    sex: String,
    age: Number,
    race_bib: String,
    passport_no: Number,
    current_address: String,
    e_mail: String,
    mobile_num: Number,
    hotel_name: String,
    race_result: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
})

module.exports = mongoose.model('Participant', ParticipantSchema);