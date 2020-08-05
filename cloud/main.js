Parse.Cloud.define('hello', function(req, res) {
  return 'Hi';
});

// Defined in cloud/main.js on Parse server side
Parse.Cloud.define('pingReply', function(request, response) {
  console.log("pinging reply")
  var params = request.params;
  var customData = params.customData;

  if (!customData) {
    response.error("Missing customData!")
  }

  var sender = JSON.parse(customData).sender;
  var query = new Parse.Query(Parse.Installation);
  query.equalTo("installationId", sender);

  Parse.Push.send({
  where: query,
  // Parse.Push requires a dictionary, not a string.
  data: {"alert": "The Giants scored!"},
  }, { success: function() {
     console.log("#### PUSH OK");
  }, error: function(error) {
     console.log("#### PUSH ERROR" + error.message);
  }, useMasterKey: true});

  response.success('success');
});


Parse.Cloud.define('pushChannelTest', async (request) =>{

  // request has 2 parameters: params passed by the client and the authorized user
  var params = request.params;
  var user = request.user;

  var customData = params.customData;
  var launch = params.launch;
  var broadcast = params.broadcast;

  // use to custom tweak whatever payload you wish to send
  var pushQuery = new Parse.Query(Parse.Installation);
  pushQuery.equalTo("deviceType", "android");


  // Note that useMasterKey is necessary for Push notifications to succeed.

  return Parse.Push.send(
            {
               where: pushQuery,      // for sending to a specific channel
               data: {
                        title: "Hello from the Cloud Code",
                        alert: "This is the alert",
                     },
            },
            {
               success: function() {
                     console.log("#### PUSH OK");
                  },
               error: function(error) {
                     console.log("#### PUSH ERROR" + error.message);
                  },
               useMasterKey: true
            });


});
