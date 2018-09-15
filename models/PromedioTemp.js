const mongoose = require('mongoose');

const { Schema } = mongoose;

const PromedioTemperatura = new Schema({
    hora: { type: Date, required: true },
    temp: { type: Number, required: true }
});

module.exports = PromedioTemperatura;