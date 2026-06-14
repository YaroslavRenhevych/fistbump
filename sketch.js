let broker = {
  hostname: 'public.cloud.shiftr.io',
  port: 443
};

let client;

let creds = {
  clientID: 'GSWA4E_ARM_Demo_webPage',
  userName: 'public',
  password: 'public'
};

let topic = 'fistbump36'

let localDiv;
let remoteDiv;
let statusDiv;
let instructionsDiv;

function setup() {
  createCanvas(windowWidth, windowHeight);
  client = new Paho.MQTT.Client(broker.hostname, broker.port, creds.clientID);
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;
  client.connect({
    onSuccess: onConnect,
    userName: creds.userName,
    password: creds.password,
    useSSL: true
  });

instructionsDiv = createDiv('Click anywhere to send a fistbump');
instructionsDiv.position(20, 20);

localDiv = createDiv('local messages will go here');
localDiv.position(20, 50);

remoteDiv = createDiv('waiting for messages');
  remoteDiv.position(20, 80);

statusDiv = createDiv('status messages will go here');
statusDiv.position(20, 110);

background(240);
}


function draw() {
}

function mousePressed() {
  sendMqttMessage('170');
  background(220);
  localDiv.html('I sent a fistbump!');
}

function mouseReleased() {
  sendMqttMessage('10');
  background(240);
  localDiv.html('I withdrew my fist');
}

function onConnect() {
  localDiv.html('client is connected');
  remoteDiv.html('topic is ' + topic);
  client.subscribe(topic);
}

function onConnectionLost(response) {
  if (response.errorCode !== 0) {
    localDiv.html('onConnectionLost: ' + response.errorMessage);
  }
}

function onMessageArrived(message) {
  remoteDiv.html('I received a message: ' + message.payloadString);
}

function sendMqttMessage(msg) {
  if (client.isConnected()) {
    message = new Paho.MQTT.Message(msg);
    message.destinationName = topic;
    client.send(message);
    statusDiv.html('I sent: ' + message.payloadString);
  }
}
