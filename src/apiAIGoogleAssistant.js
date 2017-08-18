'use strict';

const express = require('express');
const bodyParser = require('body-parser');
process.env.DEBUG = 'actions-on-google:*';
let ApiAiApp = require('actions-on-google').ApiAiApp;
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware.js')

var request=require('request');

var bmiCalc= require("../webservices/bmi");

const expressapp = express();

expressapp.use(bodyParser.urlencoded({
   extended: true
}));

expressapp.use(bodyParser.json());
expressapp.use(awsServerlessExpressMiddleware.eventContext())
console.log("Entering Express File");
//Dependencies

//---------------------------------------------------------------------------------------------
//
//---------------------------------------------------------------------------------------------
//===================================EXPRESS POST METHOD TO FIRE TRIGGERS======================
expressapp.post('/', function(req, res) {

console.log("POST");
console.log(req.body.originalRequest.source);
console.log(req.body.result.action);
//ActionName

      console.log("Action Triggers");
      if(req.body.result.action==="DiagnosisTriggerIntent.GenderInput"){
        //Business Logic
          DiagnosisTrigger(req,res);
        }//fire Gender and Age Intent
        else if(req.body.result.action==="DiagnosisTriggerIntent.GenderInput.FirstSymptom"){
          SaySymptomTrigger(req,res);
        }//fire Symptom Process Chain Intent
        else if(req.body.result.action==="UniversalYesIntent"){
          getYesResponse(req,res);
        }//fire Symptom Process Chain Intent

        else if(req.body.result.action==="UniversalNoIntent"){
          getNoResponse(req,res);
        }//fire Symptom Process Chain Intent

        else if(req.body.result.action==="FitnessInput"){
          calcFitness(req,res);
        }////fire Symptom Process Chain Intent

        else if(req.body.result.action==="NutritionDescription"){
          calcNutrition(req,res);
        }////fire Symptom Process Chain Intent


});
//---------------------------------------------------------------------------------------------
//=================================PORT LISTENER===============================================
expressapp.listen((process.env.PORT || 8000), function() {
    console.log("Server up and listening");
});



//--------------------------------------------------------------------------------------------
const SELECTION_KEY_ONE = 'title';
const SELECTION_KEY_GOOGLE_HOME = 'googleHome';
const SELECTION_KEY_GOOGLE_PIXEL = 'googlePixel';
const SELECTION_KEY_GOOGLE_ALLO = 'googleAllo';


// Constant for image URLs
const IMG_URL_AOG = 'https://developers.google.com/actions/images/badges' +
  '/XPM_BADGING_GoogleAssistant_VER.png';
const IMG_URL_GOOGLE_HOME = 'https://lh3.googleusercontent.com' +
  '/Nu3a6F80WfixUqf_ec_vgXy_c0-0r4VLJRXjVFF_X_CIilEu8B9fT35qyTEj_PEsKw';
const IMG_URL_GOOGLE_PIXEL = 'https://storage.googleapis.com/madebygoog/v1' +
  '/Pixel/Pixel_ColorPicker/Pixel_Device_Angled_Black-720w.png';
const IMG_URL_GOOGLE_ALLO = 'https://allo.google.com/images/allo-logo.png';


//=================================BUSINESS LOGIC CONTAINERS BASED ON EACH INTENT FIRED==============================================
function DiagnosisTrigger(req,res){

        global.useCaseFlag=1;

        console.log("Entering Diagnosis Trigger Google");
        var ageValueNumber=req.body.result.parameters.ageValue.amount;
        global.ageValueNumber=ageValueNumber;
        console.log("Age : "+ageValueNumber);
        var ageValueUnit=req.body.result.parameters.ageValue.amount;
        //console.log("Age : "+ageValueUnit);

        var genderValue=req.body.result.parameters.genderValue[0];
        global.genderValue=genderValue;
        console.log("Sex : "+global.genderValue);

        var ResponseString="Cool, start by giving one symptom that you are facing. I will ask you some questions if I recognise the symptom. Answer the follow up questions with yes or no.";
        const assistant = new ApiAiApp({request: req, response: res});
        if(req.body.originalRequest.source==='google'){
            console.log("Response Diagnosis Trigger for Google Family");
            basicCardDiagnosisTrigger(assistant,ResponseString);
        }


        //This Function Builds the Custom Response for this Intent
        global.followUpCounter=0;
        global.yesFlag=0;

        console.log("Exiting Diagnosis Trigger Google");
}

function SaySymptomTrigger(req,res){
  console.log("Entering saySymptom Trigger Google");
  var symptomString=req.body.result.parameters.inputSymptom;
  global.symptomString=symptomString;
  console.log("Input Symptom : "+symptomString);


  SendToParse(function(parsingFirstBody){

  console.log("Recieved from Infermedica : "+global.parsedBody.mentions);
  if(global.parsedBody.mentions.length==0)
   {

     console.log("NLP DID NOT RETURN SYMPTOM ID");
     console.log(global.parsedBody);
     var ResponseToSendBackInResponse="I didn\'t get that. Try rephrasing that symptom. Give me one symptom at a time. Something like : 'I have a severe headache'";


     if(req.body.originalRequest.source==='google'){
       const assistant = new ApiAiApp({request: req, response: res});
       SimpleResponseFallbackInBadSymptom(assistant,ResponseToSendBackInResponse);
     }


   }
   else
  {
    console.log("NLP RETURNED SYMPTOM ID");
    console.log(global.parsedBody);
    var diagnosisSymptomName=global.parsedBody.mentions[0].name;
    global.diagnosisSymptomName=diagnosisSymptomName;
    console.log("NLP Diagnosed Symptom Name : "+diagnosisSymptomName);
    var diagnosisSymptomId=global.parsedBody.mentions[0].id;
    global.diagnosisSymptomId=diagnosisSymptomId;
    console.log("NLP Diagnosed Symptom ID : "+diagnosisSymptomId);
    var diagnosisSymptomStatus=global.parsedBody.mentions[0].choice_id;
    global.diagnosisSymptomStatus=diagnosisSymptomStatus;
    console.log("NLP Diagnosed Symptom Status : "+diagnosisSymptomStatus);
    var diagnosisSymptomType=global.parsedBody.mentions[0].orth;
    console.log("NLP Diagnosed Symptom Type : "+diagnosisSymptomType);

    processSymptom(req, res);
  }

//  context.succeed(facebookResponse);
  console.log("Ended Test");
});
console.log("Ended Function");
}

function getYesResponse(req,res){
console.log("FEEDBACK TRUE FOR YES INPUT INTENT TRIGGERED");
  if(global.useCaseFlag==1)
  {//Diagnosis Module Yes
    if(global.followUpCounter==1)
      {
        global.yesFlag=1;
        processSymptom(req,res);

        //buildSpeechletResponse sends to uppermost block for ssml response processing
        //callback sends it back
      }
    }
  }
//==============================================================================================================================================================================
function calcFitness(req,res){
  console.log(req.body.result.parameters.unit_age,req.body.result.parameters.unit_gender,req.body.result.parameters.unit_length.amount);
  console.log(req.body.result.parameters.unit_length.unit,req.body.result.parameters.unit_waist,req.body.result.parameters.unit_weight.amount);
  console.log(req.body.result.parameters.unit_weight.unit);
  
  let height = req.body.result.parameters.unit_length.amount;
  let heightUnit = req.body.result.parameters.unit_length.unit.toString();
  let weight = req.body.result.parameters.unit_weight.amount.toString();
  let weightUnit = req.body.result.parameters.unit_weight.unit.toString();
  let waist = req.body.result.parameters.unit_waist.toString();
  let gender = req.body.result.parameters.unit_gender.toString();
  let age = req.body.result.parameters.unit_age.amount.toString();
  if(gender==="male"){
    gender="m";
  }else if(gender==="female"){
    gender="f";
  }
  
  if(heightUnit==="inch"){
    height=height*2.54;
    height=height.toString();
    heightUnit="cm";
  }
  else if(heightUnit==="ft"){
    height=height*12*2.54;
    height=height.toString();
    heightUnit="cm";
  }
  
  bmiCalc(height,heightUnit,weight,weightUnit,age,waist,gender,function(status,ideal_weight,risk,err){
    if(err != null){
      console.log("Data Insufficient");
    }else{
      console.log("Status : "+status);
      console.log("Ideal Weight : "+ideal_weight);
      console.log("Risk : "+risk);
      var ResponseString = `Based on your data, your ideal weight should be between ${ideal_weight}. Compared to that, you are ${status}. You may have ${risk}`;
      const assistant = new ApiAiApp({request: req, response: res});
      basicCardBMITrigger(assistant,ResponseString);
    }
  });
}
function calcNutrition(req,res){
  console.log("DESCRIPTION :",req.body.result.parameters.nutrition_desc);
  var ResponseString = req.body.result.parameters.nutrition_desc;
      const assistant = new ApiAiApp({request: req, response: res});
      basicListNutriTrigger(assistant,ResponseString);

}
  

  function getNoResponse(req,res){
  console.log("FEEDBACK TRUE FOR YES INPUT INTENT TRIGGERED");

    if(global.useCaseFlag==1)
    {//Diagnosis Module No
      if(global.followUpCounter==1)
        {
          global.yesFlag=2;
          processSymptom(req,res);

          //buildSpeechletResponse sends to uppermost block for ssml response processing
          //callback sends it back
        }
      }
    }//END NO DIAGNOSIS
//===================================BUSINESS LOGIC API CALLS AND CALLBACKS========================================================
function SendToParse(callback){
  console.log("POST Method for SendToParse Triggering");
  var options = { method: 'POST',
    url: 'https://api.infermedica.com/v2/parse',
    headers:
    { 'postman-token': '785d8d42-c9fd-b137-d1da-e44cfa4d64f1',
     'cache-control': 'no-cache',
     'app-id': 'd4f32ee4',
     'app-key': '78a4f3c44ee2ba85ca74c6fdee95828d',
     'content-type': 'application/json' },
     body: { text: global.symptomString, include_tokens: false },
     json: true };

     request(options, function (error, response, body) {
       if (error) throw new Error(error);

       //console.log(body);
       console.log(body);
       global.parsedBody=body;
       callback(global.parsedBody);
      });
}//GET DISEASE ID

function SendToDiagnose(callback){
  console.log("Going to Fire SendToDiagnose POST : "+JSON.stringify(global.buildBody));
  var options = { method: 'POST',
  url: 'https://api.infermedica.com/v2/diagnosis',
  headers:
  { 'postman-token': 'c85c7ea4-fc05-cd5c-2936-d20592218957',
    'cache-control': 'no-cache',
    'app-id': 'd4f32ee4',
    'app-key': '78a4f3c44ee2ba85ca74c6fdee95828d',
    'content-type': 'application/json' },
    body: global.buildBody,
    json: true };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      console.log("POST request");
      console.log("Recieved Body : "+JSON.stringify(body));

      global.diagnosisBody=body;
      console.log("Number of Probable Conditions : "+global.diagnosisBody.conditions.length);
      var bodyLength=global.diagnosisBody.conditions.length;
      var i=0;
      var index;
      global.flag=0;
      for(i=0;i<bodyLength;i++)
      {
        if(global.diagnosisBody.conditions[i].probability>=0.9000)
        {
          index=i;
          global.index=index;
          flag=1;
          global.flag=flag;
        }
      }
      //FOUND THE PROBABILTIES INDEX FOR HIGHER THAN 90 PERCENT
      //-------------------------------------------------------
      console.log("Probability Boolean : "+global.flag);


       callback(diagnosisBody);
      });
}//PROCESS SYMPTOM

function processSymptom(req,res){
        console.log("Entering Process POST Google");

        console.log("PROCESSING FOR FURTHER DIAGNOSIS INTENT TRIGGERED");
         if(global.followUpCounter==1)
         {
             console.log("global.followUpCounter==1");
             if(global.yesFlag==1)
               {
                 //YES WAS TRIGGERED, SO SYMPTOM IS PRESENT
                 console.log("global.yesFlag==1");
                 global.diagnosisSymptomStatus='present';

                 global.result.push({id: global.followUpSymptomId, choice_id: global.diagnosisSymptomStatus});
                 var buildBody= { sex: global.genderValue,
                                  age: global.ageValueNumber,
                                  evidence: global.result
                                };
                 global.buildBody=buildBody;
                 console.log("Follow Up Counter 1 && global.yesFlag=1 (Present) : "+global.buildBody);

               }

             else if(global.yesFlag==2)
               {
                 //NO WAS TRIGGERED, SO SYMPTOM IS ABSENT
                 console.log("global.yesFlag==2");
                 global.diagnosisSymptomStatus='absent';

                 global.result.push({id: global.followUpSymptomId, choice_id: global.diagnosisSymptomStatus});
                 var buildBody= { sex: global.genderValue,
                                  age: global.ageValueNumber,
                                  evidence: global.result
                                };
                 global.buildBody=buildBody;
                 console.log("Follow Up Counter 1 && global.yesFlag=2 (Absent) : "+global.buildBody);
               }
         }
         else if(global.followUpCounter==0)
         {
             console.log("global.followUpCounter==0");
             console.log("Body Prebuild Data on SexType : "+global.genderValue);

             var result = [];
             global.result=result;
             global.result.push({id: global.diagnosisSymptomId, choice_id: global.diagnosisSymptomStatus});
             var buildBody= { sex: global.genderValue,
                              age: global.ageValueNumber,
                              evidence: global.result
                            };
             console.log("Before Body Goes BuildBody Global : "+buildBody);
             global.buildBody=buildBody;
             console.log("Follow Up Counter 0 : "+JSON.stringify(global.buildBody));
         }

         console.log("Ready to send Request");

         SendToDiagnose(function(buildBody){

           if(global.diagnosisBody.question.type==='single')
         //NIER POINT

             {
                 console.log("Single Type Question Returned");
                 if(global.flag==1)
                 {
                     //console.log(body);

                     console.log("HIGHEST FOUND");
                     console.log("Name of disease : "+global.diagnosisBody.conditions[global.index].name);
                     var finalDiseaseName=global.diagnosisBody.conditions[global.index].name;
                     global.finalDiseaseName=finalDiseaseName;
                     console.log("Id of disease : "+global.diagnosisBody.conditions[global.index].id);
                     var finalDiseaseId=global.diagnosisBody.conditions[global.index].id;
                     global.finalDiseaseId=finalDiseaseId;
                     console.log("Probability of disease : "+global.diagnosisBody.conditions[global.index].probability);
                     var finalProbability=global.diagnosisBody.conditions[global.index].probability;
                     var probability=(finalProbability*100);
                     global.probability=probability;
                     console.log("Alexa will say : "+probability+" %");

                     global.followUpCounter=1;
                     global.yesFlag=0;
                     sayFinalDiagnosis(req, res);//GOES TO SAY FINAL DIAGNOSIS
                     //buildSpeechletResponse sends to uppermost block for ssml response processing
                     //callback sends it back*/
                 }
                 else if(global.flag==0)
                 {
                     console.log("CONTINUE TO ASK QUESTIONS");
                     console.log(global.diagnosisBody);
                     var followUpQuestion=global.diagnosisBody.question.text;
                     console.log("Follow Up Question Type : "+global.diagnosisBody.question.type);
                     var followUpQuestionType=global.diagnosisBody.question.type;
                     console.log("Follow Up Question : "+followUpQuestion);
                     console.log("Follow Up Question ID : "+global.diagnosisBody.question.items[0].id);
                     var followUpSymptomId=global.diagnosisBody.question.items[0].id;
                     global.followUpSymptomId=followUpSymptomId;
                     console.log("New Single Id to Push : "+global.followUpSymptomId);
                     console.log("Follow Up Question Symptom Lookup Name : "+global.diagnosisBody.question.items[0].name);
                     var ResponseToSendBackInResponse=followUpQuestion;


                     const assistant = new ApiAiApp({request: req, response: res});
                     if(req.body.originalRequest.source==='google'){
                         console.log("Response FollowUp Trigger for Google Family");
                         basicCardFollowUpQuestion(assistant,ResponseToSendBackInResponse);
                     }

                     //':ask' mode

                     global.followUpCounter=1;
                     global.yesFlag=0;

                 }

             }//FOR SINGLE TYPE QUESTIONS PROCESSING

             else if(global.diagnosisBody.question.type==='group_single')
             {
               console.log("GROUP SINGLE TYPE HIT");
               console.log(global.diagnosisBody);
               //global.diagnosisBody=body;

               processGroupDiagnosis(req,res);
             }//FOR GROUP TYPE QUESTIONS PROCESSING

             else if(global.diagnosisBody.question.type==='group_multiple')
             {
               console.log("GROUP MULTIPLE TYPE HIT");
               console.log(global.diagnosisBody);
               //global.diagnosisBody=body;

               processGroupDiagnosis(req,res);
             }//FOR GROUP TYPE QUESTIONS PROCESSING


           });


        console.log("Exiting POST Trigger Google");
  }//END AGE AND GENDER INPUT function

  function processGroupDiagnosis(req,res){
    console.log("GROUP DIAGNOSIS FUNCTION TRIGGERED");

    //console.log(body);
    console.log(global.diagnosisBody.question.type);//group_multiple

    console.log(global.diagnosisBody.question.text);//The followUp Question
    var groupText=global.diagnosisBody.question.text;
    console.log(global.diagnosisBody.question.items.length);
    var groupTypeBodyLength=global.diagnosisBody.question.items.length;

    global.groupIndex=0;
    var i=0;
    var speakCounter=0;
    for(i=0;i<groupTypeBodyLength;i++)
    {
        speakCounter++;
    }
    console.log("Asking Question Number : "+speakCounter);
    console.log(global.diagnosisBody.question.items[global.groupIndex].name);
    var firstInitiateGroupFollowUpName=global.diagnosisBody.question.items[global.groupIndex].name;
    console.log(global.diagnosisBody.question.items[global.groupIndex].id);
    var firstInitiateGroupFollowUpId=global.diagnosisBody.question.items[global.groupIndex].id;
    global.followUpSymptomId=firstInitiateGroupFollowUpId;
    console.log("New Group Id to Push : "+global.followUpSymptomId);
    global.groupIndex++;

    var ResponseToSendBackInResponse=groupText+". Would you say "+firstInitiateGroupFollowUpName+"?";

    //Speak Out var groupText; That is the question : "How bad is the pain? Is it + "SEVERE"? "
    const assistant = new ApiAiApp({request: req, response: res});


    if(req.body.originalRequest.source==='google'){
        console.log("Response FollowUp Group Type Trigger for Google Family");
        basicCardGroupTypeFollowUpQuestion(assistant,ResponseToSendBackInResponse);
    }

    global.followUpCounter=1;
    global.yesFlag=0;

    //speak out the First Group Follow Up
  }//END AGE AND GENDER INPUT function

  function sayFinalDiagnosis(req,res){
    console.log("FINAL DIAGNOSED INTENT TRIGGERED");

    var buildURL='https://api.infermedica.com/v2/conditions/'+  global.finalDiseaseId;
    console.log("URL Built : "+buildURL);
    var options = { method: 'GET',
    url: buildURL,
    headers:
    { 'postman-token': '20cd3cf6-7a8e-9e62-3405-9603fd782d59',
    'cache-control': 'no-cache',
    'app-id': 'd4f32ee4',
    'app-key': '78a4f3c44ee2ba85ca74c6fdee95828d',
    'content-type': 'application/json' } };

    request(options,function (error, response, body) {
      if (error) throw new Error(error);
      console.log(body);
      console.log(JSON.parse(body).name);
      var conditionNameResult=JSON.parse(body).name;
      console.log(JSON.parse(body).prevalence);
      var conditionPrevalenceResult=JSON.parse(body).prevalence;
      var conditionPrevalenceResult = conditionPrevalenceResult.charAt(0).toUpperCase() + conditionPrevalenceResult.slice(1);
      var conditionPrevalenceResult=conditionPrevalenceResult.replace(/_/g,' ');
      console.log(JSON.parse(body).acuteness);
      var conditionAcutenessResult=JSON.parse(body).acuteness;
      var conditionAcutenessResult = conditionAcutenessResult.charAt(0).toUpperCase() + conditionAcutenessResult.slice(1);
      var conditionAcutenessResult=conditionAcutenessResult.replace(/_/g,' ');
      console.log(JSON.parse(body).severity);
      var conditionSeverityResult=JSON.parse(body).severity;
      var conditionSeverityResult = conditionAcutenessResult.charAt(0).toUpperCase() + conditionAcutenessResult.slice(1);
      var conditionSeverityResult=conditionAcutenessResult.replace(/_/g,' ');
      console.log(JSON.parse(body).extras.hint);
      var conditionAdviceResult=JSON.parse(body).extras.hint;

      var ResponseToSendBackInResponse="Based on the symptoms you have given, there is a chance that you may have "+global.finalDiseaseName+". That\'s just what I can figure out. "+conditionAdviceResult;
      //Speak Out var groupText; That is the question : "How bad is the pain? Is it + "SEVERE"? "
      const assistant = new ApiAiApp({request: req, response: res});


      if(req.body.originalRequest.source==='google'){
          console.log("Response Final Trigger for Google Family");
          basicCardFinalDiagnosis(assistant,ResponseToSendBackInResponse);
      }
    

      global.useCaseFlag=0;

    });
  }
//
//---------------------------------------------------------------------------------------------------------------------------------
//===================================RESPONSE FUNCTIONS BASED ON EACH INTENT FIRED=================================================
//basicListNutriTrigger

function basicListNutriTrigger (app,ResponseString) {
    app.askWithList(app.buildRichResponse()
      .addSimpleResponse('This is a simple response for a list')
      .addSuggestions(
        ['Basic Card', 'List', 'Carousel', 'Suggestions']),
      // Build a list
      app.buildList('List Title')
        // Add the first item to the list
        .addItems(app.buildOptionItem(SELECTION_KEY_ONE,
          ['synonym of title 1', 'synonym of title 2', 'synonym of title 3'])
          .setTitle('Title of First List Item')
          .setDescription('This is a description of a list item')
          .setImage(IMG_URL_AOG, 'Image alternate text'))
        // Add the second item to the list
        .addItems(app.buildOptionItem(SELECTION_KEY_GOOGLE_HOME,
          ['Google Home Assistant', 'Assistant on the Google Home'])
          .setTitle('Google Home')
          .setDescription('Google Home is a voice-activated speaker powered ' +
            'by the Google Assistant.')
          .setImage(IMG_URL_GOOGLE_HOME, 'Google Home')
        )
        // Add third item to the list
        .addItems(app.buildOptionItem(SELECTION_KEY_GOOGLE_PIXEL,
          ['Google Pixel XL', 'Pixel', 'Pixel XL'])
          .setTitle('Google Pixel')
          .setDescription('Pixel. Phone by Google.')
          .setImage(IMG_URL_GOOGLE_PIXEL, 'Google Pixel')
        )
        // Add last item of the list
        .addItems(app.buildOptionItem(SELECTION_KEY_GOOGLE_ALLO, [])
          .setTitle('Google Allo')
          .setDescription('Introducing Google Allo, a smart messaging app ' +
            'that helps you say more and do more.')
          .setImage(IMG_URL_GOOGLE_ALLO, 'Google Allo Logo')
          .addSynonyms('Allo')
        )
    );
  }

function basicCardBMITrigger (app,ResponseToSendBackInResponse) {
  app.ask(app.buildRichResponse()
    .addBasicCard(app.buildBasicCard(ResponseToSendBackInResponse)
    .setSubtitle('These are your results:')
    .setTitle('BMI Calculator')
    .setImage(IMG_URL_AOG, 'Image alternate text'))
  );//BASIC CARD
}

function basicCardDiagnosisTrigger (app,ResponseToSendBackInResponse) {
  app.ask(app.buildRichResponse()
    .addSimpleResponse({speech: ResponseToSendBackInResponse, displayText: ''})
    .addBasicCard(app.buildBasicCard(ResponseToSendBackInResponse)
    .setSubtitle('Follow Up Question')
    .setTitle('SYMPTOM DIAGNOSIS: Say a symptom')
    .setImage(IMG_URL_AOG, 'Image alternate text'))
  );//BASIC CARD
}

function SimpleResponseFallbackInBadSymptom (app) {
  app.ask(app.buildRichResponse()
  .addSimpleResponse({speech: ResponseToSendBackInResponse, displayText: ''})
  );//SIMPLE RESPONSE
}
function basicCardFollowUpQuestion (app,ResponseToSendBackInResponse) {
  app.ask(app.buildRichResponse()
    .addSimpleResponse({speech: ResponseToSendBackInResponse, displayText: ''})
    .addBasicCard(app.buildBasicCard(ResponseToSendBackInResponse)
    .setSubtitle('Diagnosis Question No : X')
    .setTitle('SINGLE FOLLOW UP QUESTION:')
    .setImage(IMG_URL_AOG, 'Image alternate text'))
  );//BASIC CARD
}
function basicCardGroupTypeFollowUpQuestion (app,ResponseToSendBackInResponse) {
  app.ask(app.buildRichResponse()
    .addSimpleResponse({speech: ResponseToSendBackInResponse, displayText: ''})
    .addBasicCard(app.buildBasicCard(ResponseToSendBackInResponse)
    .setSubtitle('Diagnosis Group Question No : X')
    .setTitle('GROUP FOLLOW UP QUESTION:')
    .setImage(IMG_URL_AOG, 'Image alternate text'))
  );//BASIC CARD
}

  function basicCardFinalDiagnosis (app,ResponseToSendBackInResponse) {
    app.ask(app.buildRichResponse()
      .addSimpleResponse({speech: ResponseToSendBackInResponse, displayText: ''})
      .addBasicCard(app.buildBasicCard(ResponseToSendBackInResponse)
      .setSubtitle('Final Answer : X')
      .setTitle('FINAL DIAGNOSIS:')
      .setImage(IMG_URL_AOG, 'Image alternate text'))
    );//BASIC CARD
}

//-----------------------------------------------------------------------------------------------------------------------------
//======================================ACTIONS ON GOOGLE RESPONSE TEMPLATES===================================================

 function welcome (app) {


    app.ask(app.buildRichResponse()
      .addSimpleResponse({speech: 'var1 there!', displayText: 'Hello there!'})
      .addSimpleResponse({
        speech: 'I can show you basic cards, lists and carousels as well as ' +
          'suggestions on your phone',
        displayText: 'I can show you basic cards, lists and carousels as ' +
          'well as suggestions'})
      .addSuggestions(
        ['Basic Card', 'List', 'Carousel', 'Suggestions']));

  }

  function normalAsk (app) {
    app.ask('Ask me to show you a list, carousel, or basic card');
  }

   // Suggestions
  function suggestions (app) {
    app.ask(app
      .buildRichResponse()
      .addSimpleResponse('This is a simple response for suggestions')
      .addSuggestions('Suggestion Chips')
      .addSuggestions(['Basic Card', 'List', 'Carousel'])
      .addSuggestionLink('Suggestion Link', 'https://assistant.google.com/'));
  }

  // Basic card
  function basicCard (app) {
    app.ask(app.buildRichResponse()
      .addSimpleResponse('This is the first simple response for a basic card')
      .addSuggestions(
        ['Basic Card', 'List', 'Carousel', 'Suggestions'])
        // Create a basic card and add it to the rich response
      .addBasicCard(app.buildBasicCard(`This is a basic card.  Text in a
      basic card can include "quotes" and most other unicode characters
      including emoji 📱.  Basic cards also support some markdown
      formatting like *emphasis* or _italics_, **strong** or __bold__,
      and ***bold itallic*** or ___strong emphasis___ as well as other things
      like line  \nbreaks`) // Note the two spaces before '\n' required for a
                            // line break to be rendered in the card
        .setSubtitle('This is a subtitle')
        .setTitle('Title: this is a title')
        .addButton('This is a button', 'https://assistant.google.com/')
        .setImage(IMG_URL_AOG, 'Image alternate text'))
      .addSimpleResponse({ speech: 'This is the 2nd simple response ',
        displayText: 'This is the 2nd simple response' })
    );
  }

  // List
  function list (app) {
    app.askWithList(app.buildRichResponse()
      .addSimpleResponse('This is a simple response for a list')
      .addSuggestions(
        ['Basic Card', 'List', 'Carousel', 'Suggestions']),
      // Build a list
      app.buildList('List Title')
        // Add the first item to the list
        .addItems(app.buildOptionItem(SELECTION_KEY_ONE,
          ['synonym of title 1', 'synonym of title 2', 'synonym of title 3'])
          .setTitle('Title of First List Item')
          .setDescription('This is a description of a list item')
          .setImage(IMG_URL_AOG, 'Image alternate text'))
        // Add the second item to the list
        .addItems(app.buildOptionItem(SELECTION_KEY_GOOGLE_HOME,
          ['Google Home Assistant', 'Assistant on the Google Home'])
          .setTitle('Google Home')
          .setDescription('Google Home is a voice-activated speaker powered ' +
            'by the Google Assistant.')
          .setImage(IMG_URL_GOOGLE_HOME, 'Google Home')
        )
        // Add third item to the list
        .addItems(app.buildOptionItem(SELECTION_KEY_GOOGLE_PIXEL,
          ['Google Pixel XL', 'Pixel', 'Pixel XL'])
          .setTitle('Google Pixel')
          .setDescription('Pixel. Phone by Google.')
          .setImage(IMG_URL_GOOGLE_PIXEL, 'Google Pixel')
        )
        // Add last item of the list
        .addItems(app.buildOptionItem(SELECTION_KEY_GOOGLE_ALLO, [])
          .setTitle('Google Allo')
          .setDescription('Introducing Google Allo, a smart messaging app ' +
            'that helps you say more and do more.')
          .setImage(IMG_URL_GOOGLE_ALLO, 'Google Allo Logo')
          .addSynonyms('Allo')
        )
    );
  }

  // Carousel
  function carousel (app) {
    app.askWithCarousel(app.buildRichResponse()
      .addSimpleResponse('This is a simple response for a carousel')
      .addSuggestions(
        ['Basic Card', 'List', 'Carousel', 'Suggestions']),
      app.buildCarousel()
        // Add the first item to the carousel
        .addItems(app.buildOptionItem(SELECTION_KEY_ONE,
          ['synonym of title 1', 'synonym of title 2', 'synonym of title 3'])
          .setTitle('Title of First List Item')
          .setDescription('This is a description of a carousel item')
          .setImage(IMG_URL_AOG, 'Image alternate text'))
        // Add the second item to the carousel
        .addItems(app.buildOptionItem(SELECTION_KEY_GOOGLE_HOME,
          ['Google Home Assistant', 'Assistant on the Google Home'])
          .setTitle('Google Home')
          .setDescription('Google Home is a voice-activated speaker powered ' +
            'by the Google Assistant.')
          .setImage(IMG_URL_GOOGLE_HOME, 'Google Home')
        )
        // Add third item to the carousel
        .addItems(app.buildOptionItem(SELECTION_KEY_GOOGLE_PIXEL,
          ['Google Pixel XL', 'Pixel', 'Pixel XL'])
          .setTitle('Google Pixel')
          .setDescription('Pixel. Phone by Google.')
          .setImage(IMG_URL_GOOGLE_PIXEL, 'Google Pixel')
        )
        // Add last item of the carousel
        .addItems(app.buildOptionItem(SELECTION_KEY_GOOGLE_ALLO, [])
          .setTitle('Google Allo')
          .setDescription('Introducing Google Allo, a smart messaging app ' +
            'that helps you say more and do more.')
          .setImage(IMG_URL_GOOGLE_ALLO, 'Google Allo Logo')
          .addSynonyms('Allo')
        )
    );
  }

  // React to list or carousel selection
  function itemSelected (app) {
    const param = app.getSelectedOption();
    console.log('USER SELECTED: ' + param);
    if (!param) {
      app.ask('You did not select any item from the list or carousel');
    } else if (param === SELECTION_KEY_ONE) {
      app.ask('You selected the first item in the list or carousel');
    } else if (param === SELECTION_KEY_GOOGLE_HOME) {
      app.ask('You selected the Google Home!');
    } else if (param === SELECTION_KEY_GOOGLE_PIXEL) {
      app.ask('You selected the Google Pixel!');
    } else if (param === SELECTION_KEY_GOOGLE_ALLO) {
      app.ask('You selected Google Allo!');
    } else {
      app.ask('You selected an unknown item from the list or carousel');
    }
  }

  // Recive a rich response from API.AI and modify it
  function cardBuilder (app) {
    app.ask(app.getIncomingRichResponse()
      .addBasicCard(app.buildBasicCard(`Actions on Google let you build for
       the Google Assistant. Reach users right when they need you. Users don’t
       need to pre-enable skills or install new apps.  \n  \nThis was written
       in the fulfillment webhook!`)
        .setSubtitle('Engage users through the Google Assistant')
        .setTitle('Actions on Google')
        .addButton('Developer Site', 'https://developers.google.com/actions/')
        .setImage('https://lh3.googleusercontent.com/Z7LtU6hhrhA-5iiO1foAfGB' +
          '75OsO2O7phVesY81gH0rgQFI79sjx9aRmraUnyDUF_p5_bnBdWcXaRxVm2D1Rub92' +
          'L6uxdLBl=s1376', 'Actions on Google')));
  }

  // Leave conversation with card
  function byeCard (app) {
    app.tell(app.buildRichResponse()
      .addSimpleResponse('Goodbye, World!')
      .addBasicCard(app.buildBasicCard('This is a goodbye card.')));
  }

  // Leave conversation with SimpleResponse
  function byeResponse (app) {
    app.tell({speech: 'Okay see you later',
      displayText: 'OK see you later!'});
  }

  // Leave conversation
  function normalBye (app) {
    app.tell('Okay see you later!');
  }

module.exports = expressapp;
