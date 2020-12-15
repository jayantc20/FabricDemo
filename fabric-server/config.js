var path = require("path");
var util = require("util");
require('fabric-ca-client');
var hfc = require("fabric-client");


var file = 'network-config%s.yaml';

var env = process.env.TARGET_NETWORK;
if (env)
	file = util.format(file, '-' + env);
else
	file = util.format(file, '');
hfc.setConfigSetting('network-connection-profile-path',path.join(__dirname, '../' , 'artifacts' ,file));
hfc.setConfigSetting('org0-connection-profile-path',path.join(__dirname, '../' ,'artifacts', 'org0.yaml'));
hfc.addConfigFile(path.join(__dirname, 'config.json'));
