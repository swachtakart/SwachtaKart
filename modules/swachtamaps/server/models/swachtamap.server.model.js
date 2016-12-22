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
  mapName: {
    type: String,
    default: '',
    required: 'Please fill Swachtamap name',
    trim: true
  },
  mapCreatedAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: Schema.ObjectId,
    ref: 'User'
  },
   mapType: {
    type: String,
    enum: ['Air','Water','Land','Thought']
  }, 
   mapLocationLat: {
    type: Number
  },
   mapLocationLng: {
    type: Number
  },
  mapLocationUrl:{
    type:String
  }

});

mongoose.model('Swachtamap', SwachtamapSchema);
