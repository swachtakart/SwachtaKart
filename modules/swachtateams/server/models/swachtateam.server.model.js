'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Swachtateam Schema
 */
var SwachtateamSchema = new Schema({
  teamName: {
    type: String,
    default: '',
    required: 'Please fill Swachtateam name',
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  teamOwner: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  teamSize: {
	type: Number,
	default:'1'
  },
  createdBy: {
	type: Schema.ObjectId,
	ref: 'User'
  },
  teamMembers: {
	 type:[]
  }
});

mongoose.model('Swachtateam', SwachtateamSchema);
