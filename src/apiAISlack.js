
let express = require('express');
let bodyParser = require('body-parser');
let app = express();
let https= require('https');
var port = process.env.PORT || 3000;
var Alexa = require('alexa-sdk');
var request=require('request');
var busData = require('../busDatabase');
//Dependencies
//
//====================================================================//
module.exports ={

transportslack: function(event,context){
          console.log("Entering Transport Slack");

          var destinationName = [];
          var destinationTime = [];
          var destinationBusNo= [];
          var builtActionBody= [];
          var possibleHits= [];
          var indexHoldings= [];
          //Find length of JSON

          console.log("Total Bus Entries : "+busData().busServices.length);
          //prints length of all bus entries incoming from JSON
          console.log("Location Input : "+event.result.contexts[0].parameters.location);
          var inputSearch=event.result.contexts[0].parameters.location.toLowerCase();
          console.log("Boarding Type Input : "+event.result.contexts[0].parameters.boardingType);
          var timeSession=event.result.contexts[0].parameters.boardingType;

          var dayParameter;
          if(timeSession==="Boarding Point")
          {
              dayParameter="AM";
          }
          else if(timeSession==="Drop Point")
          {
              dayParameter="PM";
          }
          console.log("Searching For : "+inputSearch);
          var j=0;
          var index;
          var found=0;
          var finalBuses="";

          for(i=0;i<busData().busServices.length;i++)
          {
            if(busData().busServices[i].Destination.toLowerCase().includes(inputSearch) && busData().busServices[i].Time.includes(dayParameter))
            {

              indexHoldings[j]=i;
              j++;
              found++;
            }
          }

          if(found!=0)
          {
            console.log("Matches Found");
            for(var i=0;i<busData().busServices.length;i++)
            {
              for (var j = 0; j < indexHoldings.length; j++) {

                  if(indexHoldings[j]==i)
                  {
                    destinationBusNo[j] = busData().busServices[i].Bus_No;
                    destinationName[j] = busData().busServices[i].Destination;
                    destinationTime[j] = busData().busServices[i].Time;
                    builtActionBody.push({"name": destinationName[j], "text": destinationName[j],"type":"button","value": destinationName[j]});
                    console.log(builtActionBody);
                    console.log("bus no:="+busData().busServices[i].Bus_No);
                    console.log("bus destinations:="+busData().busServices[i].Destination);
                    console.log("bus timings:="+busData().busServices[i].Time);

                  }//end iffff

              }//end nest for

            }//end outer for
              if(indexHoldings.length==1&&timeSession==="Boarding Point")
              {
                var busFinalData="Bus Boarding Point : "+destinationName+" , Bus Number : "+destinationBusNo+" , Bus Time : "+destinationTime;
                var slackResponse={
                                "speech": "",
                                "displayText": "",
                                "data": {
                                  "slack": {
                                          "text": busFinalData

                                    }
                                },
                                "contextOut": [],
                                "source": "DuckDuckGo"
                              };
                context.succeed(slackResponse);
              }
              else if(indexHoldings.length==1&&timeSession==="Drop Point")
              {
                var busFinalData="Bus Drop Point : "+destinationName+" , Bus Number : "+destinationBusNo+" , Bus Time : "+destinationTime;
                var slackResponse={
                                "speech": "",
                                "displayText": "",
                                "data": {
                                  "slack": {
                                          "text": busFinalData

                                    }
                                },
                                "contextOut": [],
                                "source": "DuckDuckGo"
                              };
                context.succeed(slackResponse);
              }



            var slackResponse={
                            "speech": "",
                            "displayText": "",
                            "data": {
                              "slack": {
                                    "text": "Here ",
                                    "attachments": [
                                            {
                                              "text": "Choose exact location",
                                              "fallback": "You are unable to choose a drop point",
                                              "callback_id": "wopr_game",
                                              "color": "#3AA3E3",
                                              "attachment_type": "default",
                                              "actions": builtActionBody
                                            }
                                        ]
                                      }
                            },
                            "contextOut": [],
                            "source": "DuckDuckGo"
                          };

                          context.succeed(slackResponse);

          }//end matched if

          else if(found==0)
          {
            console.log("No Matches Found");

            var slackResponse={
                            "speech": "",
                            "displayText": "",
                            "data": {
                              "slack": {
                                      "text": "Sorry, our Hexaware spaceships dont land there. :D"

                                }
                            },
                            "contextOut": [],
                            "source": "DuckDuckGo"
                          };
                          context.succeed(slackResponse);
          }
        console.log("Ended");

        console.log(destinationBusNo);
        console.log(destinationName);
        console.log(destinationTime);

        },

        routeslack: function(event,context){
                console.log("Entering Route Slack");

                console.log("Total Bus Entries : "+busRoute().busRouteImages.length);
                //prints length of all bus entries incoming from JSON
                console.log("Bus Number Input : "+event.result.parameters.bno);
                var inputBusNumberForRouteSearch=event.result.parameters.bno;

                console.log("Searching Route for Bus Number : "+inputBusNumberForRouteSearch);
                var i;
                var j=0;
                var index;
                var found=0;
                var finalBuses="";
                //var foundURL;

                for(i=0;i<busRoute().busRouteImages.length;i++)
                {
                  if(busRoute().busRouteImages[i].Bus_No==inputBusNumberForRouteSearch)
                  {
                      index=i;
                      found=1;
                  }
                }

                if(found==1)
                {
                  console.log("Bus Found in Database");
                  var foundURL=busRoute().busRouteImages[index].URL
                  var slackResponse={
                                  "speech": "",
                                  "displayText": "",
                                  "data": {
                                    "slack": {
                                          "text": "Here ",
                                          "attachments": [
                                                  {
                                                    "text": "Choose exact location",
                                                    "fallback": "You are unable to choose a drop point",
                                                    "callback_id": "wopr_game",
                                                    "color": "#3AA3E3",
                                                    "attachment_type": "default",
                                                    "actions": builtActionBody
                                                  }
                                              ]
                                            }
                                  },
                                  "contextOut": [],
                                  "source": "DuckDuckGo"
                                };

                                context.succeed(slackResponse);
                }
                else if(found==0)
                {
                  console.log("Bus Not in Database");
                  var slackResponse={
                                  "speech": "",
                                  "displayText": "",
                                  "data": {
                                    "slack": {
                                            "text": "Sorry, that bus number does not exist."

                                      }
                                  },
                                  "contextOut": [],
                                  "source": "DuckDuckGo"
                                };
                                context.succeed(slackResponse);

                }

                console.log("Ended");
          }//END ROUTE FUNCTION

}
