var request = require("request");
var proxy = require('express-http-proxy');
var app = require('express')();

var Service, Characteristic;

module.exports = function(homebridge) {
	Service = homebridge.hap.Service;
	Characteristic = homebridge.hap.Characteristic;

	homebridge.registerAccessory("homebridge-kunalight", "Kuna", KunaAccessory);
}

function KunaAccessory(log, config) {
	this.log = log;
	this.name = config["name"];
	this.email = config["email"];
	this.password = config["password"];
	this.serial = config["serial"].toUpperCase();
	this.proxyThumbnail = config["proxyThumbnail"];
	this.proxyPort = config["proxyPort"] || 3000;
	this.pollingInterval = config["polling"] === undefined ? 15 : Number(config["polling"]);
	this.authToken = "";
	this.authURL = "https://server.kunasystems.com/api/v1/account/auth/";
	this.statusURL = "https://server.kunasystems.com/api/v1/cameras/" + this.serial + "/?live=1";
	this.proxyStarted = false;

	this.service = new Service.Lightbulb(this.name);
	
	this.service
		.getCharacteristic(Characteristic.On)
		.on('get', this.getState.bind(this))
		.on('set', this.setState.bind(this));	
}

KunaAccessory.prototype.getAuthToken = function(){
	this.log("Getting Authentication Token...");
		
	request({
	    url: this.authURL,
	    method: "POST",
	    json: {"email":this.email,"password":this.password}
	},
	
	function (error, response, body) {
		if (!error && response.statusCode === 200) {
			this.log.debug(body);
			this.authToken = body.token;
			
			if (this.proxyThumbnail && this.proxyStarted != true) {
				this.log("Proxying Thumbnail Enabled Use URL: http://127.0.0.1:" + this.proxyPort + "/thumbnail");

				app.use('/thumbnail', proxy('server.kunasystems.com', {
					https: true,
					proxyReqOptDecorator: function(proxyReqOpts) {
						proxyReqOpts.headers['Authorization'] = "Token " + this.authToken;
						return proxyReqOpts;
					}.bind(this),
					proxyReqPathResolver: function (req) {
						return "/api/v1/cameras/" + this.serial + "/thumbnail/?live=0";
				    }.bind(this)
				}));

				app.listen(this.proxyPort);
				this.proxyStarted = true;

			} else {
				this.log.debug("Proxing Thumbnail Disabled");
			}
						
			this.getState();
		} else {
			this.log("Error Getting Authentication Token - Please Check Login Credentials");
			this.log.debug("Response Status Code: " + response.statusCode);
			this.log.debug("Response Body" + body);
		}
	}.bind(this));
}

KunaAccessory.prototype.getState = function(callback) {
	this.log("Getting current state...");
	this.log.debug(this.statusURL);
	
	request.get({
		url: this.statusURL,
		headers: { "Authorization": "Token " + this.authToken }
	},

	function (error, response, body) {
		if (!error && response.statusCode === 200) {
			this.log.debug(body);
			var json = JSON.parse(body);
			var state = json.bulb_on;
			
			this.log("Light is currently %s", state? "ON": "OFF");
			this.service.getCharacteristic(Characteristic.On).updateValue(state);
			if (typeof callback !== 'undefined') callback(null, state);

		} else {
			this.log("Error Getting State - Response Status Code: " + response.statusCode);
			this.log.debug("Response Body" + body);
			if (response.statusCode === 401) {
				console.log("Authorization Token Expired Getting New One");
				this.getAuthToken();
			}
			if (typeof callback !== 'undefined') callback(error);
		}
	}.bind(this));
}
  
KunaAccessory.prototype.setState = function(state, callback) {
	this.log("Setting State...");
	this.log.debug(this.statusURL);
	
	request({
		url: this.statusURL,
		method: "PATCH",
		json: {"bulb_on":state},
		headers: { "Authorization": "Token " + this.authToken }
	},

	function (error, response, body) {
		if (!error && response.statusCode === 200) {
			this.log.debug(body);
			var state = body.bulb_on;
			
			this.log("Light is currently %s", state? "ON": "OFF");
			this.service.getCharacteristic(Characteristic.On).updateValue(state)
			if (typeof callback !== 'undefined') callback(null, state);

		} else {
			this.log("Error Setting State - Response Status Code: " + response.statusCode);
			this.log.debug("Response Body" + body);
			if (response.statusCode === 401) {
				console.log("Authorization Token Expired Getting New One");
				this.getAuthToken();
			}
			if (typeof callback !== 'undefined') callback(error);
		}
	}.bind(this))	
}

KunaAccessory.prototype.getServices = function() {
	this.log.debug("getServices");
	
	if (this.pollingInterval > 0) {
		this.log("Creating polling timer for every " + this.pollingInterval + " minutes");
		this.timer = setInterval(
			this.getState.bind(this),
			this.pollingInterval * 60000
		);
	} else {
		this.log.debug("Polling Disabled");
	}

	this.getAuthToken();
	return [this.service];
}