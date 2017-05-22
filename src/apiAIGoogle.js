
let express = require('express');
let bodyParser = require('body-parser');
let app = express();
let https= require('https');
var port = process.env.PORT || 3000;

var request=require('request');


//Dependencies
//====================================================================//
module.exports ={
//

        DiagnosisTrigger: function(event,context){
                console.log("Entering Diagnosis Trigger Google");
                var ageValueNumber=event.result.parameters.ageValue.amount;
                global.ageValueNumber=ageValueNumber;
                console.log("Age : "+ageValueNumber);
                var ageValueUnit=event.result.parameters.ageValue.amount;
                //console.log("Age : "+ageValueUnit);

                var genderValue=event.result.parameters.genderValue;
                console.log("Age : "+genderValue);
                global.genderValue=genderValue;
                var ResponseString="Cool, start by giving one symptom that you are facing. I will ask you some questions if I recognise the symptom. Answer the follow up questions with yes or no.";
                var googleResponse={
                                  "speech": ResponseString,
                                  "displayText": ResponseString,
                                  "contextOut": [],
                                  "source": "DuckDuckGo"
                                };
                context.succeed(googleResponse);
                global.followUpCounter=0;
                global.yesFlag=0;

                console.log("Exiting Diagnosis Trigger Google");
          },//END AGE AND GENDER INPUT function

          SaySymptomTrigger: function(event,context){
            console.log("Entering saySymptom Trigger Google");
            var symptomString=event.result.parameters.inputSymptom;
            global.symptomString=symptomString;
            console.log("Input Symptom : "+symptomString);


            SendToParse(function(parsingFirstBody){

            console.log("Sending : "+global.parsedBody.mentions);
            if(global.parsedBody.mentions.length==0)
             {

               console.log("NLP DID NOT RETURN SYMPTOM ID");
               console.log(global.parsedBody);
               var ResponseString="I didn\'t get that. Try rephrasing that symptom. Give me one symptom at a time.";
               var googleResponse={
                                 "speech": ResponseString,
                                 "displayText": ResponseString,
                                 "contextOut": [],
                                 "source": "DuckDuckGo"
                               };
               context.succeed(googleResponse);


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

              // var ResponseString="I didn\'t get that. Try rephrasing that symptom. Give me one symptom at a time.";
              // var googleResponse={
              //                   "speech": diagnosisSymptomName,
              //                   "displayText": diagnosisSymptomName,
              //                   "contextOut": [],
              //                   "source": "DuckDuckGo"
              //                 };
              // context.succeed(googleResponse);
              processSymptom(event, context);
            }

          //  context.succeed(facebookResponse);
            console.log("Ended Test");
          });

        },

        getYesResponse: function (event,context){
        console.log("FEEDBACK TRUE FOR YES INPUT INTENT TRIGGERED");
        if(global.followUpCounter==1)
          {
            global.yesFlag=1;
            processSymptom(event,context);

            //buildSpeechletResponse sends to uppermost block for ssml response processing
            //callback sends it back
          }
        },//YES DIAGNOSIS

        getNoResponse: function (event,context){
        console.log("FEEDBACK TRUE FOR YES INPUT INTENT TRIGGERED");
        if(global.followUpCounter==1)
          {
            global.yesFlag=2;
            processSymptom(event,context);

            //buildSpeechletResponse sends to uppermost block for ssml response processing
            //callback sends it back
          }
        }//END NO DIAGNOSIS
}
//===============================================================================

        function SendToParse(callback){

          var options = { method: 'POST',
            url: 'https://api.infermedica.com/v2/parse',
            headers:
            { 'postman-token': '785d8d42-c9fd-b137-d1da-e44cfa4d64f1',
             'cache-control': 'no-cache',
             'app-id': '03d4fd34',
             'app-key': '97fdf41e07745fe24dc8a7f8dfdad177',
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
        }

        function SendToDiagnose(callback){
          console.log("SendToDiagnose Callback : "+callback);
          var options = { method: 'POST',
          url: 'https://api.infermedica.com/v2/diagnosis',
          headers:
          { 'postman-token': 'c85c7ea4-fc05-cd5c-2936-d20592218957',
            'cache-control': 'no-cache',
            'app-id': '03d4fd34',
            'app-key': '97fdf41e07745fe24dc8a7f8dfdad177',
            'content-type': 'application/json' },
            body: buildBody,
            json: true };

            request(options, function (error, response, body) {
              if (error) throw new Error(error);
              console.log("POST request");
              console.log("Recieved Body : "+body);

              global.diagnosisBody=body;
              console.log("Number of Probable Conditions : "+global.diagnosisBody.conditions.length);
              var bodyLength=global.diagnosisBody.conditions.length;
              var i=0;
              //var index;
              var flag=0;
              for(i=0;i<bodyLength;i++)
              {
                if(global.diagnosisBody.conditions[i].probability>=0.9000)
                {
                  global.index=i;
                  global.flag=1;
                }
              }
              //FOUND THE PROBABILTIES INDEX FOR HIGHER THAN 90 PERCENT
              //-------------------------------------------------------
              console.log("Probability Boolean : "+global.flag);


               callback(global.diagnosisBody);
              });
        }

        function processSymptom(event,context){
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
                         console.log("Follow Up Counter 1 && global.yesFlag=1 (Present) : "+buildBody);

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
                         console.log("Follow Up Counter 1 && global.yesFlag=2 (Absent) : "+buildBody);
                       }
                 }
                 else if(global.followUpCounter==0)
                 {
                     console.log("global.followUpCounter==0");
                     var result = [];
                     global.result=result;
                     global.result.push({id: global.diagnosisSymptomId, choice_id: global.diagnosisSymptomStatus});
                     var buildBody= { sex: global.genderValue,
                                      age: global.ageValueNumber,
                                      evidence: global.result
                                    };
                     console.log("Follow Up Counter 0 : "+JSON.stringify(buildBody));
                 }

                 console.log("Ready to send Request");

                 SendToDiagnose(function(buildBody){

                   if(global.DiagnoseBody.question.type==='single')
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
                             sayFinalDiagnosis(event, context);//GOES TO SAY FINAL DIAGNOSIS
                             //buildSpeechletResponse sends to uppermost block for ssml response processing
                             //callback sends it back*/
                         }
                         else if(global.flag==0)
                         {
                             console.log("CONTINUE TO ASK QUESTIONS");
                             console.log(body);
                             var followUpQuestion=body.question.text;
                             console.log("Follow Up Question Type : "+body.question.type);
                             var followUpQuestionType=body.question.type;
                             console.log("Follow Up Question : "+followUpQuestion);
                             console.log("Follow Up Question ID : "+body.question.items[0].id);
                             var followUpSymptomId=body.question.items[0].id;
                             global.followUpSymptomId=followUpSymptomId;
                             console.log("New Single Id to Push : "+global.followUpSymptomId);
                             console.log("Follow Up Question Symptom Lookup Name : "+body.question.items[0].name);

                             var googleResponse={
                                               "speech": followUpQuestion,
                                               "displayText": followUpQuestion,
                                               "contextOut": [],
                                               "source": "DuckDuckGo"
                                             };
                             context.succeed(googleResponse);


                             //':ask' mode

                             global.followUpCounter=1;
                             global.yesFlag=0;

                         }

                     }//FOR SINGLE TYPE QUESTIONS PROCESSING

                     else if(body.question.type==='group_single')
                     {
                       console.log("GROUP SINGLE TYPE HIT");
                       console.log(body);
                       global.body=body;

                       processGroupDiagnosis(event,context);
                     }//FOR GROUP TYPE QUESTIONS PROCESSING

                     else if(body.question.type==='group_multiple')
                     {
                       console.log("GROUP MULTIPLE TYPE HIT");
                       console.log(body);
                       global.body=body;

                       processGroupDiagnosis(event,context);
                     }//FOR GROUP TYPE QUESTIONS PROCESSING


                   });


                console.log("Exiting POST Trigger Google");
          }//END AGE AND GENDER INPUT function


              function processGroupDiagnosis(event,context){
                console.log("GROUP DIAGNOSIS FUNCTION TRIGGERED");

                //console.log(body);
                console.log(global.body.question.type);//group_multiple

                console.log(global.body.question.text);//The followUp Question
                var groupText=global.body.question.text;
                console.log(global.body.question.items.length);
                var groupTypeBodyLength=global.body.question.items.length;

                global.groupIndex=0;
                var i=0;
                var speakCounter=0;
                for(i=0;i<groupTypeBodyLength;i++)
                {
                    speakCounter++;
                }
                console.log("Asking Question Number : "+speakCounter);
                console.log(global.body.question.items[global.groupIndex].name);
                var firstInitiateGroupFollowUpName=global.body.question.items[global.groupIndex].name;
                console.log(global.body.question.items[global.groupIndex].id);
                var firstInitiateGroupFollowUpId=global.body.question.items[global.groupIndex].id;
                global.followUpSymptomId=firstInitiateGroupFollowUpId;
                console.log("New Group Id to Push : "+global.followUpSymptomId);
                global.groupIndex++;

                var ResponseString=groupText+". Would you say "+firstInitiateGroupFollowUpName;
                //Speak Out var groupText; That is the question : "How bad is the pain? Is it + "SEVERE"? "
                var googleResponse={
                                  "speech": ResponseString,
                                  "displayText": ResponseString,
                                  "contextOut": [],
                                  "source": "DuckDuckGo"
                                };
                context.succeed(googleResponse);


                global.followUpCounter=1;
                global.yesFlag=0;

                //speak out the First Group Follow Up
              }//END AGE AND GENDER INPUT function

              function sayFinalDiagnosis(event,context){
                console.log("FINAL DIAGNOSED INTENT TRIGGERED");

                var buildURL='https://api.infermedica.com/v2/conditions/'+  global.finalDiseaseId;
                console.log("URL Built : "+buildURL);
                var options = { method: 'GET',
                url: buildURL,
                headers:
                { 'postman-token': '20cd3cf6-7a8e-9e62-3405-9603fd782d59',
                'cache-control': 'no-cache',
                'app-id': '03d4fd34',
                'app-key': '97fdf41e07745fe24dc8a7f8dfdad177',
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

                  var ResponseString="Based on the symptoms you have given,there is a chance that you may have "+global.finalDiseaseName+". That\'s just what I can figure out. "+conditionAdviceResult;
                  //Speak Out var groupText; That is the question : "How bad is the pain? Is it + "SEVERE"? "
                  var googleResponse={
                                    "speech": ResponseString,
                                    "displayText": ResponseString,
                                    "contextOut": [],
                                    "source": "DuckDuckGo"
                                  };
                  context.succeed(googleResponse);
                });
              }
