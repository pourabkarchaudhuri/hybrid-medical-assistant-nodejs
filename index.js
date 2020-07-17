//Authors : Pourab Karchaudhuri, Abhishek Dash
//Description : Hybrid MultiChannel Node.js Script for MultiChannel Functionality

//Android, HTML and iOS API.AI Developer Client ID 
//github Repo : https://github.com/pourabkarchaudhuri/hybrid-routfinder-nodejs

/*
Existing Functional Channels
----------------------------
Alexa
Facebook
Slack
HTML Direct
iOS
Android
*/
////
//===================================================DEPENDENCIES DECLARATION=====================================================

'use strict';
const awsServerlessExpress = require('aws-serverless-express')
const app = require('./src/apiAIGoogleAssistant');
const server =  awsServerlessExpress.createServer(app);


const express = require('express');
const bodyParser = require('body-parser');
// const app = express();
const https= require('https');
const JSONbig = require('json-bigint');
const async = require('async');
const requestPromise = require('request-promise');
var request=require('request');
const port = process.env.PORT || 3000;


//dependencies.

//=======================================HANDLER FUNCTION FOR AWS LAMBDA FOR CHANNEL DETECTION=====================================
//handler function for AWS Lambda
//
exports.handler = function(event, context, callback){

  console.log("1"+JSON.stringify(event));
  console.log("2"+JSON.stringify(event.body));
  console.log("1"+JSON.stringify(context));
  //console.log("1"+JSON.stringify(callback));
  awsServerlessExpress.proxy(server, event, context)
}


//===============================================ALEXA SKILL INTENT CONTAINER================================================
//ALEXA SKILLS CONTAINER
//var handlers contain all alexa intents sdk style.

// var handlers = sessionHandlers;
//===============================================ONE CODE TO RULE THEM ALL===================================================

