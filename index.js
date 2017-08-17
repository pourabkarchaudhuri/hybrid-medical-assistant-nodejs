//Authors : Pourab Karchaudhuri, Abhishek Dash
//Description : Hybrid MultiChannel Node.js Script for MultiChannel Functionality
//Alexa ARN : arn:aws:lambda:us-east-1:458140612472:function:myRoutFinder
//API.AI Webhook : https://w22iydl6p9.execute-api.us-east-1.amazonaws.com/Dev
//Android, HTML and iOS API.AI Developer Client ID  : a66431caef284e66a107b7137d9bb874
//github Repo : https://github.com/pourabkarchaudhuri/hybrid-routfinder-nodejs
//Testing Accounts : htlp003@gmail.com
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
/*Yours Truly : Hexaware Innovation Lab (A.K.A : The Geek Squad);☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☻☻☻☻☻☻☻☻☻☻☻☻☻☺☺☺☺☻☻☻☻☺☺*/
/*Yours Truly : Hexaware Innovation Lab (A.K.A : The Geek Squad);☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☻☻☻☻☻☻☻☻☻☻☻☻☻☺☺☺☺☻☻☻☻☺☺*/
/*Yours Truly : Hexaware Innovation Lab (A.K.A : The Geek Squad);☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☻☻☻☻☻☻☻☻☻☻☻☻☻☺☺☺☺☻☻☻☻☺☺*/
