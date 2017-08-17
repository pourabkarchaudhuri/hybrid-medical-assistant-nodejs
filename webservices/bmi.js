module.exports=function bmiCalc(height,heightUnit,weight,weightUnit,age,waist,gender,callback){
 //function bmiCalc(height,heightUnit,weight,weightUnit,age,waist,gender,callback){
    console.log("about to make get call to bmi api");
    var request = require("request");

    var options = { 
        method: 'POST',
        url: 'https://bmi.p.mashape.com/',
        headers: { 
            accept: 'application/json',
            'content-type': 'application/json',
            'x-mashape-key': 'kB9uYBX1SBmshk4iwAXzx5nkzDPHp16kfpJjsnNWMWojkes95i'
         },
        body: { 
            weight: { value: weight, unit: weightUnit },
            height: { value: height, unit: heightUnit },
            sex: gender,
            age: age,
            waist: waist 
        },
            json: true 
    };
    console.log("Options : "+JSON.stringify(options));
    request(options, function (error, response, body) {
    //if (error) throw new Error(error);
    console.log("API response : ",JSON.stringify(body));

    if(body.hasOwnProperty('error')){
        callback(null,null,null,503);
    }else{
    console.log("inside webservices",body.bmi.status,body.ideal_weight,body.bmi.risk);
    callback(body.bmi.status,body.ideal_weight,body.bmi.risk,null);
     }
    });
    
}

// bmiCalc("76","in","73","kg","3","28","m",function(status,range,risk){
//     console.log(status,range,risk);
// });