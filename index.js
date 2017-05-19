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
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const https= require('https');
const JSONbig = require('json-bigint');
const async = require('async');
const requestPromise = require('request-promise');
var request=require('request');
var Alexa = require('alexa-sdk');
const port = process.env.PORT || 3000;
var sessionHandlers=require('./src/alexa');
//var apiAISlack=require('./src/apiAISlack');
//var apiAIFacebook=require('./src/apiAIFacebook');
var apiAIGoogle=require('./src/apiAIGoogle');
//var otherSources=require('./src/otherSources');
//dependencies.

//=======================================HANDLER FUNCTION FOR AWS LAMBDA FOR CHANNEL DETECTION=====================================
//handler function for AWS Lambda
//
exports.handler = function(event, context, callback){

  console.log("1"+JSON.stringify(event));
  console.log("1"+JSON.stringify(context));

  if(event.hasOwnProperty('session')) //session from Alexa Request JSON
  {
          console.log("RequestFromAlexaSkillKit");

          //Trigger Alexa Function
          var alexa = Alexa.handler(event, context);
          alexa.registerHandlers(handlers); //handlers contain alexa-sdk function based intent logic
          alexa.execute();
  }//FOR ALEXA SKILL

  else if(event.hasOwnProperty('result'))//session from APIAI Webhook Request JSON
  {

            console.log("RequestFromAPI.AI");
            //Prepare API.AI Response

            if(event.hasOwnProperty('originalRequest')){
                  if(event.originalRequest.source==="facebook")
                  {
                    //facebook
                          console.log("Source Facebook");

                  }

                  else if(event.originalRequest.source==="slack_testbot")
                  {
                    //Slack
                            console.log("Source slack_testbot");

                  }

                  else if(event.originalRequest.source==="google")
                  {
                    //Google
                            console.log("Source Google");
                            if(event.result.action==="location"){
                              apiAIGoogle.BMRCalculator(event,context);
                            }//fire transport method for bus route path request

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

var handlers = sessionHandlers;
//===============================================ONE CODE TO RULE THEM ALL===================================================
/*Yours Truly : Hexaware Innovation Lab (A.K.A : The Geek Squad);☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☻☻☻☻☻☻☻☻☻☻☻☻☻☺☺☺☺☻☻☻☻☺☺*/
/*Yours Truly : Hexaware Innovation Lab (A.K.A : The Geek Squad);☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☻☻☻☻☻☻☻☻☻☻☻☻☻☺☺☺☺☻☻☻☻☺☺*/
/*Yours Truly : Hexaware Innovation Lab (A.K.A : The Geek Squad);☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☺☻☻☻☻☻☻☻☻☻☻☻☻☻☺☺☺☺☻☻☻☻☺☺*/
