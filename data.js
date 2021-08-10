const mongoose = require('mongoose')

const ariBnbSchema = mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  title: String,
  rating: String,
  Reviews: Number,
})

module.exports = mongoose.model('AirBnbDetails', ariBnbSchema)
