const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todosSchema = new Schema({
  name: { type: 'String', required: true, trim: true, maxlength: 250 },
  done: { type: 'Boolean', default: false },
  createdAt: { type: 'Date', default: Date.now, required: true },
});

module.exports = mongoose.model('Todos', todosSchema);