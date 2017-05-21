
let express = require('express');
let bodyParser = require('body-parser');
let app = express();
let https= require('https');
var port = process.env.PORT || 3000;

var request=require('request');


//Dependencies
//====================================================================//
module.exports ={

        BMRCalculator: function(event,context){
                console.log("Entering BMR Calculator Facebook");
                



                // BMRm = 66.5 + ( 13.75 × weight in kg ) + ( 5.003 × height in cm ) – ( 6.755 × age in years )
                // BMRw = 655.1 + ( 4.35 × weight in pounds ) + ( 4.7 × height in inches ) - ( 4.7 × age in years )



                console.log("Ended");
          }//END ROUTE FUNCTION

}
