
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
//
//====================================================================//
module.exports ={

transportothers: function(event,context){
          console.log("Entering Transport Others");

          var destinationName = [];
          var destinationTime = [];
          var destinationBusNo= [];
          var builtActionBody= [];
          var possibleHits= [];
          var indexHoldings= [];
          //Find length of JSON

          var builtSpeechBody="";
          var builtTextBody="";

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
                    builtSpeechBody=builtSpeechBody+", "+destinationName[j];
                    builtTextBody=builtTextBody+", "+destinationName[j];

                  }//end iffffff

              }//end nest for

            }//end outer for
              if(indexHoldings.length==1&&timeSession==="morning")
              {
                var busFinalData="Bus Boarding Point : "+destinationName+" , Bus Number : "+destinationBusNo+" , Bus Time : "+destinationTime;
                var othersResponse={
                                "speech": busFinalData,
                                "displayText": busFinalData,
                                "contextOut": [],
                                "source": "DuckDuckGo"
                              };
                context.succeed(othersResponse);
              }
              else if(indexHoldings.length==1&&timeSession==="evening")
              {
                var busFinalData="Bus Drop Point : "+destinationName+" , Bus Number : "+destinationBusNo+" , Bus Time : "+destinationTime;
                var othersResponse={
                                "speech": busFinalData,
                                "displayText": busFinalData,
                                "contextOut": [],
                                "source": "DuckDuckGo"
                              };
                context.succeed(othersResponse);
              }



              var othersResponse={
                              "speech": builtSpeechBody,
                              "displayText": builtTextBody,
                              "contextOut": [],
                              "source": "DuckDuckGo"
                            };

                          context.succeed(othersResponse);

          }//end matched if

          else if(found==0)
          {
            console.log("No Matches Found");

            var othersResponse={
                            "speech": "Sorry, our Hexaware spaceships dont land there.",
                            "displayText": "Sorry, our Hexaware spaceships dont land there. :D",
                            "contextOut": [],
                            "source": "DuckDuckGo"
                          };
                          context.succeed(othersResponse);
          }
        console.log("Ended");

        console.log(destinationBusNo);
        console.log(destinationName);
        console.log(destinationTime);

        },

        routeothers: function(event,context){
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
                  var foundRoutePathText=busRoute().busRouteImages[index].BusRouteText;
                  var foundRoutePathSpeech=busRoute().busRouteImages[index].BusRouteSpeech;

                var othersResponse={
                                "speech": foundRoutePathSpeech,
                                "displayText": foundRoutePathText,
                                "contextOut": [],
                                "source": "DuckDuckGo"
                              };
                                context.succeed(othersResponse);
                }
                else if(found==0)
                {
                  console.log("Bus Not in Database");
                  var othersResponse={
                                  "speech": "That Bus Number does not exist",
                                  "displayText": "That Bus Number does not exist",
                                  "contextOut": [],
                                  "source": "DuckDuckGo"
                                };
                                context.succeed(othersResponse);

                }

                console.log("Ended");
          }//END ROUTE FUNCTION

}
