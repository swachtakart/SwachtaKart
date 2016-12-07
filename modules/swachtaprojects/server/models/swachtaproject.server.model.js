'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Swachtaproject Schema
 */
var SwachtaprojectSchema = new Schema({
  projectName: {
    type:String
  }, 
  projectType: {
	type:String,
	enum:['Air','Water','Land']
  }, 
  projectLocationUrl: {
	type:String
  }, 
  projectAddress: {
	type:String
  },
  projectCost: {
	type:Number
  },
	projectBidCost:{
		type:Number
	},
	projectAssignedTo:{
		type:Schema.ObjectId,
		ref:'User'
	},
	projectPostedBy:{
		type:Schema.ObjectId,
		ref:'User'
	},
	projectCreatedAt:{
		type:Date,
		default:Date.now
	},
	projectDueDate:{
		type:Date
	},
	isValid:{
		type:Boolean,
		default:true
	},
	isCompleted:{
		type:Boolean,
		default:false
	},
	transferForDiscussion:{
		type:Boolean,
		default:false
	},
	projectCompletedAt:{
		type:Date
	}
});

mongoose.model('Swachtaproject', SwachtaprojectSchema);
