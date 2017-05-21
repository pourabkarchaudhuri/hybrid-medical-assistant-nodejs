
let express = require('express');
let bodyParser = require('body-parser');
let app = express();
let https= require('https');
var port = process.env.PORT || 3000;

var request=require('request');


//Dependencies
//====================================================================//
module.exports ={

        DiagnosisTrigger: function(event,context){
                console.log("Entering Diagnosis Trigger Google");
                var ageValueNumber=event.result.parameters.ageValue.amount;
                global.ageValueNumber=ageValueNumber;
                console.log("Age : "+ageValueNumber);
                var ageValueUnit=event.result.parameters.ageValue.amount;
                console.log("Age : "+ageValueUnit);

                var genderValue=event.result.parameters.genderValue;
                console.log("Age : "+genderValue);
                global.genderValue=genderValue;
                var googleResponse={
                                  "speech": "",
                                  "displayText": "",
                                  "data": {
                                    "facebook": {
                                            "text": "Age and Gender Webhook Successful"

                                      }
                                  },
                                  "contextOut": [],
                                  "source": "DuckDuckGo"
                                };
                                context.succeed(googleResponse);

                }
                console.log("Exiting Diagnosis Trigger Google");
          }//END ROUTE FUNCTION

}
