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
3
'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const https= require('https');
const JSONbig = require('json-bigint');
const async = require('async');
const requestPromise = require('request-promise');
var request=require('request');
const port = process.env.PORT || 3000;
var apiAIGoogle=require('./src/apiAIGoogle');
//dependencies.

//=======================================HANDLER FUNCTION FOR AWS LAMBDA FOR CHANNEL DETECTION=====================================
//handler function for AWS Lambda
//
exports.handler = function(event, context, callback){

  console.log("1"+JSON.stringify(event));
  console.log("1"+JSON.stringify(context));
  console.log("1"+JSON.stringify(callback));


  if(event.hasOwnProperty('result'))//session from APIAI Webhook Request JSON
  {

            console.log("RequestFromAPI.AI");
            //Prepare API.AI Response

            if(event.hasOwnProperty('originalRequest')){
                  if(event.originalRequest.source==="google")
                  {
                    //Google
                            console.log("Source Google");
                            if(event.result.action==="DiagnosisTriggerIntent.GenderInput"){
                              apiAIGoogle.DiagnosisTrigger(event,context);
                            }//fire Gender and Age Intent

                  }
                }
                else{
                      //otherSources like iOS, HTML Direct and Android
                              console.log("Other Sources");

                }
}//FOR API.AI CONTEXTS
else
  {
      console.log("Unknown Source");
  }//FOR UNKNOWN SOURCES
};//

//===============================================ALEXA SKILL INTENT CONTAINER================================================
//ALEXA SKILLS CONTAINER
//var handlers contain all alexa intents sdk style.

// var handlers = sessionHandlers;
//===============================================ONE CODE TO RULE THEM ALL===================================================
/*Yours Truly : Hexaware Innovation Lab (A.K.A : The Geek Squad);☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☻☻☻☻☻☻☻☻☻☻☻☻☻☺☺☺☺☻☻☻☻☺☺*/
/*Yours Truly : Hexaware Innovation Lab (A.K.A : The Geek Squad);☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☻☻☻☻☻☻☻☻☻☻☻☻☻☺☺☺☺☻☻☻☻☺☺*/
/*Yours Truly : Hexaware Innovation Lab (A.K.A : The Geek Squad);☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☻☻☻☻☻☻☻☻☻☻☻☻☻☺☺☺☺☻☻☻☻☺☺*/
