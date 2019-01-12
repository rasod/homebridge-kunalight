# homebridge-kunalight

[Homebridge](https://github.com/nfarina/homebridge) plugin to control the light found on the [Kuna/Maximus Smart Security Light](https://getkuna.com).

# Installation
1. Install [Homebridge](https://github.com/nfarina/homebridge#installation)
2. Install this plugin using `npm install -g homebridge-kunalight`
3. Edit your configuration file like the example below and restart Homebridge.

# Configuration
```
{
  "accessories": [
    {
        "accessory": "Kuna",
        "name": "Front Door",
        "email": "",
        "password" : "",
		"serial":""
    }
  ]
}
```
