var busRoute = require('../busRouteImageDatabase')

module.exports={
  'LaunchRequest': function() {

        tempContext=this;


        this.attributes['speechOutput']="Welcome to Route Finder";
        this.attributes['repromptSpeech']="Are you there? Speak Up";
        this.emit(':ask', this.attributes['speechOutput'],this.attributes['repromptSpeech']);
    },

    'BasicCardIntent': function () {

              console.log("Alexa Route Intent Triggered");

              console.log("Total Bus Entries : "+busRoute().busRouteImages.length);
              //prints length of all bus entries incoming from JSON
              var inputBusNumberForRouteSearch=this.event.request.intent.slots.readBusNumberInput.value;
              console.log("Bus Number Input : "+inputBusNumberForRouteSearch);


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
                console.log(foundRoutePath);
                var cardTitle = 'Hexaware Bus Route';
                var cardContent = `${foundRoutePath}`;
                var speechOutput = `I have sent the Bus Route for Hexaware Bus ${inputBusNumberForRouteSearch} to your companion app.`;
                this.emit(':tellWithCard', speechOutput, cardTitle, cardContent);
              }

              else if(found==0)
              {
                console.log("Bus Not in Database");
                var speechOutput = 'I don\'t have the route for this bus.';
                this.emit(':tell', speechOutput);
              }

    }
};

/*
var cardTitle = 'Basic Card';
var cardContent = 'This text will be displayed in the companion app card to link Account.';
var speechOutput = 'I have sent the bus route map to your companion app'
/*var imageObj = {
                  smallImageUrl: 'https://imgs.xkcd.com/comics/standards.png',
                  largeImageUrl: 'https://imgs.xkcd.com/comics/standards.png'
                };
this.attributes['speechOutput']="Goto your companion app"
this.emit(':tell', speechOutput);*/
