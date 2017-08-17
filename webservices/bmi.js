module.exports=function bmiCalc(height,heightUnit,weight,weightUnit,age,waist,gender,callback){
// function bmiCalc(height,heightUnit,weight,weightUnit,age,waist,gender,callback){
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

    request(options, function (error, response, body) {
    if (error) throw new Error(error);

    // console.log(body);
    console.log("inside webservices",body.bmi.status,body.ideal_weight,body.bmi.risk);
    callback(body.bmi.status,body.ideal_weight,body.bmi.risk);
    });

}

// bmiCalc("170.00","cm","85.00","kg","23","34.00","m",function(status,range,risk){
//     console.log(status,range,risk);
// });