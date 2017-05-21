var request = require("request")
var Hapi = require('hapi');
var Slack = require('slack-node');
var h = 0;
var s = 0;
var e = 0;

function onlineBooking(){
request({
    url: "http://example.com",
    json: true
}, function (error, response, body) {

    if (!error && response.statusCode === 200) {
        
        // 'if/else' checks that it receives an up respsose four times in a row 
        // the variable e is increased by .25 for every 200(ok response) until e reaches 1
        // it will then send a message that the server is up
        if(e < 1  && response.statusCode === 200){
            setTimeout(function () {
           console.log(response.statusCode) // Print the response code
            e =e+0.25;
            }, 6000); // 6 seconds delay between each response 
        }
        
    else {
          while(h == 0){
        console.log(response.statusCode) // Print the response code
        console.log("********************")
        slackReviewBot("Website :robot_face: ", response.statusCode + " - OK", "http://example.com", "");
            h++;
            s = 0; 
          } 
        }// end of else
    }// end of if
    else {
        console.log(response.statusCode) // Print the response code
        e = 0;
        setTimeout(function () {  
        while(s == 0){
         
        console.log(response.statusCode) // Print the response code
        console.log("********************")
        slackReviewBot("Website :robot_face: ", response.statusCode, "http://example.com", "");
            s++;
            h=0;
        }}, 3000);
    } // end of else
    
})

}

// sets the loop for checking every 7 seconds

setInterval(function(){

    onlineBooking();
    
}, 7000); 


//  this function sends server name, a message and url to slack
function slackReviewBot(servername, body, urls, bod) {
    
var time = require('time');
// Create a new Date instance
var now = new time.Date();
now.setTimezone("Europe/London");

    var bo = body; 
    var bod = bod;
    var urls = urls;
    var sname = servername; 
    // you'll need to replace the slack webhook below
    // you'll find info on webhooks here https://api.slack.com/incoming-webhooks
    var webhook_url = 'https://hooks.slack.com/services/xxxxxxxxxxxxxxxxxxxxxx';
    slack = new Slack();
    slack.setWebhook(webhook_url);
    
        slack.webhook({
        channel: "#server-uptime",
        username: "Server:",
        icon_emoji: "http://www.wonderfulwebsites.ie/phorest-logo.png",
        text: " " + "\n" + 
            "*" + sname + " * " + "\n" +
            "Status: " + bo + "\n" +
            now + "\n" +
            "Check the status here: " + urls + "\n" +
            "http://status.phorest.com/" +
             "\n" +  JSON.stringify(bod)
            
        }, function(err, response) {      
        console.log(response);
        }); 
}



// below is so you can send a test json object to the server
// http POST localhost:1337/jsonpost test=Test 
// you'll get a slack message letting you know the server is running
var server = new Hapi.Server();
server.connection({
    port: 1337
});

exports.add = function(i, j) {
    return i + j;
};

//  Slack function for sending the test reply
function slackReviewBot2(testserver) {
    testserver = testserver;
      // you'll need to replace the slack webhook below
    // you'll find info on webhooks here https://api.slack.com/incoming-webhooks
    var webhook_url = 'https://hooks.slack.com/services/xxxxxxxxxxxxxxxxxxxxxxxxxx';
    slack2 = new Slack();
    slack2.setWebhook(webhook_url);
    
  
        slack.webhook({
        channel: "#server-uptime",
        username: "Server-Test-Reply:",
        icon_emoji: "http://www.wonderfulwebsites.ie/phorest-logo.png",
        text: ":star: :star: :star: :star: :star:" + "\n" + 
            "\n" + 
            "Sever is up and running!!!"

        }, function(err, response) {
            
        console.log(response);
        });
}


// take the json object for testing
server.route({
  method: 'POST'
, path: '/jsonpost',
handler: function(req, reply) {
    
     var review = {
      userName: req.payload.userName
      }
            //passes the review to the slackbot function 
            slackReviewBot2(review.userName);
            reply("Received");
    } 
});

// prints a server running message 
server.start(function(){
    console.log('server running at: ', server.info.url);
});
