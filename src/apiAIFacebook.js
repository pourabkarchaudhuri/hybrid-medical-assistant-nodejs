
let express = require('express');
let bodyParser = require('body-parser');
let app = express();
let https= require('https');
var port = process.env.PORT || 3000;
var Alexa = require('alexa-sdk');
var request=require('request');
var busData = require('../busDatabase');
var busRoute = require('../busRouteImageDatabase')
//Dependencies
//====================================================================//
module.exports ={

transportfacebook: function(event,context){
          console.log("Entering Transport Facebook");

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
          if(timeSession==="morning")
          {
              dayParameter="AM";
          }
          else if(timeSession==="evening")
          {
              dayParameter="PM";
          }
          console.log("Searching For : "+inputSearch);
          var j=0;
          var index;
          var found=0;
          var finalBuses="";
//
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
                    builtActionBody.push({"content_type":"text", "title": destinationName[j], "payload": destinationName[j]});
                    console.log(builtActionBody);
                    console.log("bus no:="+busData().busServices[i].Bus_No);
                    console.log("bus destinations:="+busData().busServices[i].Destination);
                    console.log("bus timings:="+busData().busServices[i].Time);

                  }//end iffffff

              }//end nest for

            }//end outer for
              if(indexHoldings.length==1&&timeSession==="morning")
              {
                var busFinalData="Bus Boarding Point : "+destinationName+" , Bus Number : "+destinationBusNo+" , Bus Time : "+destinationTime;
                var facebookResponse={
                                "speech": "",
                                "displayText": "",
                                "data": {
                                  "facebook": {

                                            "text":busFinalData

                                        }

                                },
                                "contextOut": [],
                                "source": "DuckDuckGo"
                              };
                context.succeed(facebookResponse);
              }
              else if(indexHoldings.length==1&&timeSession==="evening")
              {
                var busFinalData="Bus Drop Point : "+destinationName+" , Bus Number : "+destinationBusNo+" , Bus Time : "+destinationTime;
                var facebookResponse={
                                "speech": "",
                                "displayText": "",
                                "data": {
                                  "facebook": {

                                            "text":busFinalData

                                        }

                                },
                                "contextOut": [],
                                "source": "DuckDuckGo"
                              };
                context.succeed(facebookResponse);
              }



              var facebookResponse={
                              "speech": "",
                              "displayText": "",
                              "data": {
                                "facebook": {

                                          "text":"Which one exactly?",
                                          "quick_replies":builtActionBody
                                      }

                              },
                              "contextOut": [],
                              "source": "DuckDuckGo"
                            };
                            console.log("check"+facebookResponse);
                          context.succeed(facebookResponse);

          }//end matched if

          else if(found==0)
          {
            console.log("No Matches Found");

            var facebookResponse={
                            "speech": "",
                            "displayText": "",
                            "data": {
                              "facebook": {
                                      "text": "Sorry, our Hexaware spaceships dont land there. :D"

                                }
                            },
                            "contextOut": [],
                            "source": "DuckDuckGo"
                          };
                          context.succeed(facebookResponse);
          }
        console.log("Ended");

        console.log(destinationBusNo);
        console.log(destinationName);
        console.log(destinationTime);

        },
//
        routefacebook: function(event,context){
                console.log("Entering Route Facebook");

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
                  var foundURL=busRoute().busRouteImages[index].URL;
                  var foundRoutePath=busRoute().busRouteImages[index].BusRouteText;
                  /*var facebookResponse={
                                  "speech": "",
                                  "displayText": "",
                                  "data": {
                                    "facebook": {
                                      "attachment":{
                                          "type":"template",
                                          "payload":{
                                            "template_type":"generic",
                                            "elements":[
                                               {
                                                "title":"Here is your Route Chart",
                                                "image_url":foundURL,
                                                "subtitle":"Click to enlarge the Route Image.",
                                                "default_action": {
                                                    "type": "web_url",
                                                    "url": foundURL,
                                                    },
                                                "buttons":[
                                                  {
                                                    "type":"postback",
                                                    "title":"Start Afresh",
                                                    "payload":"hi"
                                                  }
                                                ]
                                              }
                                            ]
                                          }
                                        }
                                      }

                                  },
                                  "contextOut": [],
                                  "source": "DuckDuckGo"
                                };*/

                var facebookResponse={
                                "speech": "",
                                "displayText": "",
                                "data": {
                                  "facebook": {
                                          "text": foundRoutePath

                                    }
                                },
                                "contextOut": [],
                                "source": "DuckDuckGo"
                              };
                                context.succeed(facebookResponse);
                }
                else if(found==0)
                {
                  console.log("Bus Not in Database");
                  var facebookResponse={
                                  "speech": "",
                                  "displayText": "",
                                  "data": {
                                    "facebook": {
                                            "text": "That bus number does not exist"

                                      }
                                  },
                                  "contextOut": [],
                                  "source": "DuckDuckGo"
                                };
                                context.succeed(facebookResponse);

                }

                console.log("Ended");
          }//END ROUTE FUNCTION

}
