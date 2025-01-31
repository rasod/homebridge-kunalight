> [!CAUTION]
> This project is no longer maintained, I do not have access to any Kuna devices.

# homebridge-kunalight

[Homebridge](https://github.com/nfarina/homebridge) plugin to control the light found on the [Kuna/Maximus Smart Security Light](https://getkuna.com). Can also be used with [homebridge-camera-ffmpeg](https://github.com/KhaosT/homebridge-camera-ffmpeg) to create a camera accessory for viewing thumbnail from camera. __Live camera feed not supported.__

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

# Configuration Parameters 

* ```name``` __(required)__ Name of light to appear in Home app
* ```email``` __(required)__ Login email for the Kuna app
* ```password``` __(required)__ Password for the Kuna app
* ```serial``` __(required)__ Serial number of the Kuna light (can be found in the Kuna app)
* ```polling``` Optional value (interger) in minutes for how often the lights status should be updated. Default is 15 minutes, set to 0 to disable polling.
* ```proxyThumbnail``` Optional value, set to true to enable proxying of live thumbnail for use with [homebridge-camera-ffmpeg](https://github.com/KhaosT/homebridge-camera-ffmpeg)
* ```proxyPort``` Optional value (default 3000) set to the port that the proxyed thumbnail image will be served on. If you have multiple cameras each will require their own port.

# Proxying Thumbnail

If you enable the Proxy Thumbnail option ```"proxyThumbnail":true``` this will allow you to setup a camera accessory using [homebridge-camera-ffmpeg](https://github.com/KhaosT/homebridge-camera-ffmpeg). Make sure to name the camera different from the light.

__Note: This will not allow you to view the live feed from your camrea only a still image.__

## Configuration Example with Image Enabled

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
		"serial":"<Serial number of light found in Kuna App>",
		"proxyThumbnail":true
	}]
	"platforms": [{
		"platform": "Camera-ffmpeg",
		"cameras": [{
			"name": "Front Door Camera",
				"videoConfig": {
					"source": "-i http://127.0.0.1:3000/<CAMERA SERIAL NUMBER>",
					"stillImageSource": "-i http://127.0.0.1:3000/<CAMERA SERIAL NUMBER>",
					"maxStreams": 1,
					"maxWidth": 640,
					"maxHeight": 360,
					"maxFPS": 30
				}
			}
		]
	}]
}

```
