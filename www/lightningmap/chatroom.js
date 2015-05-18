 
function chatroom(chattext, inputtext, userlist, username){

	var client = null;
	//var host= "10.10.14.187";
	var host= "dev.pelmorex.com";
	//var host="66.252.159.32"
	//var host="10.10.202.33"

	
	var r = Math.round(Math.random()*Math.pow(10,5));
	var d = new Date().getTime();
	var cid = r.toString() + "-" + d.toString()
	
	username.value = r.toString();
	var knownname = username.value;

	initiatlizeChatroom();
	
	function initiatlizeChatroom(){
		client = new Messaging.Client(host, 52169, cid);

		client.onConnect = onConnect;
	  
		client.onMessageArrived = onMessageArrived;
		client.onConnectionLost = onConnectionLost;            

		client.connect({onSuccess:onConnect, onFailure:onFailure}); 
	}

	

	function onConnect(frame) {
	  console.log("ChatRoom connected to MQTT");
	  client.subscribe("Pelmorex/Chat/RoomLightning");
	  client.subscribe("Pelmorex/Chat/RoomLightning/Ping");
	  
	  text = '{"ping":"'+username.value+'"}';

	  message = new Messaging.Message(text);
	  message.destinationName = "Pelmorex/Chat/RoomLightning/Ping";
	  client.send(message);
	  
	  inputtext.onkeyup = function(e){
        e = e || event;
        if (e.keyCode === 13) {
          // start your submit function
		  var s = inputtext.value;
		  
			text = '{"username":"'+username.value+'",'+
					'"message":"'+s.substring(0, s.length-1)+'",'+
					'"knownname":"'+knownname+'"}';

			knownname = username.value;

			//json.Parse
			message = new Messaging.Message(text);
			message.destinationName = "Pelmorex/Chat/RoomLightning";
			client.send(message);
		 // chattext.value = chattext.value + inputtext.value;
			inputtext.value = "";
        }
        return false;
	  }
    }  

	function onMessageArrived(message) {
		jsonMessage = JSON.parse(message.payloadString);
		if (jsonMessage.ping != undefined)
		{
			text = '{"username":"'+username.value+'",'+
				   '"knownname":"'+knownname+'"}';
			
			knownname = username.value;
			message = new Messaging.Message(text);
			message.destinationName = "Pelmorex/Chat/RoomLightning";
			client.send(message);
		}
		else
		{
			if (jsonMessage.message != undefined)
				chattext.value = chattext.value + jsonMessage.username + ': ' + jsonMessage.message + '\n';// message.payloadString;

			var s = userlist.value;
			if (s.indexOf(jsonMessage.username)<0)
				s = s + jsonMessage.username + '\n';
			if (jsonMessage.knownname != undefined)
			{
				if ((jsonMessage.knownname != jsonMessage.username) && (s.indexOf(jsonMessage.knownname)>=0))
				{
					s = s.replace(jsonMessage.knownname+'\n', '');
				}
				
			}
			userlist.value = "";
			userlist.value = userlist.value + s;

		}
	//	chattext.value = chattext.value +  message.payloadString;
		return(true);
	}

	function onConnectionLost(responseObject) {
		console.log(responseObject);
		setTimeout(function()
		{
			initiatlizeChatroom();
		}, 1000);
	}

	function onFailure(failure) {
		host="dev.pelmorex.com"
		console.log(failure);
		setTimeout(function() {
			initiatlizeChatroom();
				}, 1000);
	}  
}

	