# homebridge-kunalight

[Homebridge](https://github.com/nfarina/homebridge) plugin to control the light found on the [Kuna/Maximus Smart Security Light](https://getkuna.com).

# Installation
1. Install [Homebridge](https://github.com/nfarina/homebridge#installation)
2. Install this plugin using `npm install -g homebridge-kunalight`
3. Edit your configuration file like the example below and restart Homebridge

# Configuration Example
```
{
	"bridge": {
		"name": "Homebridge",
		"username":"CE:CE:CE:CE:CE:CE",
		"port": 51826,
		"pin": "131-25-154"
	},
	"accessories": [{
		"accessory": "Kuna",
		"name": "Front Door",
		"email": "<email used to login to Kuna App>",
		"password" : "<password used to login to Kuna App>",
		"serial":"<Serial number of light found in Kuna App>"
	}]
}
```

* ```name``` __(required)__ Name of light to appear in Home app
* ```email``` __(required)__ Login email for the Kuna app
* ```password``` __(required)__ Password for the Kuna app
* ```serial``` __(required)__ Serial number of the Kuna light (can be found in the Kuna app)
* ```polling``` Optional value (interger) in minutes for how often the lights status should be updated. Default is 15 minutes, set to 0 to disable polling.
