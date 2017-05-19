
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


                console.log("Ended");
          }//END ROUTE FUNCTION

}
