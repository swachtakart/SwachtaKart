'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Swachtamap Schema
 */
var SwachtamapSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Swachtamap name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Swachtamap', SwachtamapSchema);
