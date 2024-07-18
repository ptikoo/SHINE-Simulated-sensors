var mqtt = require('mqtt');
const ACCESS_TOKEN = process.env.DEVICE_ACCESS_TOKEN;

var client  = mqtt.connect('mqtt://demo.thingsboard.io',{
    username: ACCESS_TOKEN
});

var controlValue = 29,
	realValue = 25;

client.on('connect', function () {
    console.log('connected');
    client.subscribe('v1/devices/me/rpc/request/+');
    console.log('Uploading temperature data once per second...');
    setInterval(publishTelemetry, 10000);
});

client.on('message', function (topic, message) {
    console.log('request.topic: ' + topic);
    console.log('request.body: ' + message.toString());
    var requestId = topic.slice('v1/devices/me/rpc/request/'.length),
    	messageData = JSON.parse(message.toString());
    if (messageData.method === 'getValue') {
    	if(controlValue === undefined) {
            client.publish('v1/devices/me/rpc/response/' + requestId, JSON.stringify(realValue));
		} else {
            client.publish('v1/devices/me/rpc/response/' + requestId, JSON.stringify(controlValue));
		}
    } else if (messageData.method === 'setValue') {
    	controlValue = messageData.params;
    	console.log('Going to set new control value: ' + controlValue);
    } else {	
    	client.publish('v1/devices/me/rpc/response/' + requestId, message);
    }
});

function publishTelemetry() {
	emulateTemperatureChanging();
	client.publish('v1/devices/me/telemetry', JSON.stringify({temperature: realValue}));
}

function emulateTemperatureChanging() {
	if(controlValue !== undefined) {
		if(controlValue >= realValue) {
			realValue += (Math.random()*10 + (Math.abs(controlValue - realValue)/30));
		} else {
			realValue -= (Math.random()*10 + (Math.abs(controlValue - realValue)/30));
		}
	}
}