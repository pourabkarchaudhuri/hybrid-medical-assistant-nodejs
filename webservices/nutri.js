// module.exports=function calcNutrition(description,callback){

    var request = require("request");

var options = { 
    method: 'POST',
    url: 'https://trackapi.nutritionix.com/v2/natural/nutrients',
    headers: {
        'postman-token': '23c18515-4563-b81b-afbf-81b74e1b0f1b',
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        'x-app-key': '86c5a572897889d84c8d20f4d174806e',
        'x-app-id': 'a3cb0203' 
    },
    body:{
        query: "i had 4 pcs of chicken and a bowl of rice"
    },
    json: true
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(JSON.stringify(body));
});

// }