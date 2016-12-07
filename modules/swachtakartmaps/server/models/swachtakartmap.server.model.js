'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Swachtakartmap Schema
 */
var SwachtakartmapSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Swachtakartmap name',
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

mongoose.model('Swachtakartmap', SwachtakartmapSchema);
