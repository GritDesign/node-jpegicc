var spawn = require("child_process").spawn;
var binary = "jpegicc";

var version = process.version.split('.');
var _END_EVENT = "exit";
if (0 === parseInt(version[0].replace("v",""), 10) && version[1] > 6) _END_EVENT = "close";

function arrayify(obj) {
	var ary = [];
	for (var a in obj) {
		ary.push(a);
		if (obj[a] !== true) ary.push(obj[a]);
	}
	return ary;
}

/* 
	little cms ICC profile applier for JPEG - v2.1

	usage: jpegicc [flags] input.jpg output.jpg

	flags:

	-v - Verbose
	-i<profile> - Input profile (defaults to sRGB)
	-o<profile> - Output profile (defaults to sRGB)
	-t<0,1,2,3> - Intent (0=Perceptual, 1=Colorimetric, 2=Saturation, 3=Absolute)

	-b - Black point compensation
	-f<n> - Preserve black (CMYK only) 0=off, 1=black ink only, 2=full K plane
	-n - Ignore embedded profile
	-e - Embed destination profile
	-s<new profile> - Save embedded profile as <new profile>

	-c<0,1,2,3> - Precalculates transform (0=Off, 1=Normal, 2=Hi-res, 3=LoRes) [defaults to 1]

	-p<profile> - Soft proof profile
	-m<0,1,2,3> - SoftProof intent
	-g - Marks out-of-gamut colors on softproof

	-q<0..100> - Output JPEG quality

	-d<0..1> - Observer adaptation state (abs.col. only)

	-h<0,1,2> - More help
*/

function ICC() {
	this.options = {};
}

ICC.prototype = {
	handleArgs: function(field, value) {
		if (value === null) delete this.options[field];
		else if (value) this.options[field] = value;
		else return this.options[field];
	},
	handleBool: function(field, value) {
		if (typeof value === "undefined") return this.options[field] ? true : false;
		else if (value) this.options[field] = value;
		else delete this.options[field];
	},
	verbose: function(value) {
		this._v = value ? true: false;
		// set verbose flag and have stderr and stdout print to console.
		// Also show arguments when calling process.
	},
	inputProfile: function(value) {
		return(this.handleArgs("-i", value));
	},
	outputProfile: function(value) {
		return(this.handleArgs("-o", value));
	},
	intent: function(value) {
		return(this.handleArgs("-t", value));
	},
	blackpointCompensation: function(value) {
		return(this.handleBool("-b", value));
	},
	preserveBlack: function(value) {
		return(this.handleBool("-f", value));
	},
	ignoreEmbeddedProfile: function(value) {
		return(this.handleBool("-n", value));
	},
	embedDestinationProfile: function(value) {
		return(this.handleBool("-e", value));
	},
	saveEmbeddedProfile: function(value) {
		return(this.handleArgs("-s", value));
	},
	precalculatesTransform: function(value) {
		return(this.handleArgs("-c", value));
	},
	softProofProfile: function(value) {
		return(this.handleArgs("-p", value));
	},
	softProofIntent: function(value) {
		return(this.handleArgs("-m", value));
	},
	markOutOfGamutColors: function(value) {
		return(this.handleBool("-g", value));
	},
	quality: function(value) {
		return(this.handleArgs("-q", value));
	},
	observerAdaptationState: function(value) {
		return(this.handleArgs("-d", value));
	},
	process: function(source, destination, cb) {
		var self = this;

		var args = arrayify(self.options);
		args.push(source);
		args.push(destination);
		if (self._v) {
			console.log("calling jpegicc");
			console.log("jpegicc " + args.join(" "));
		}
		var stderr = "";
		var stdout = "";
		var proc = spawn('jpegicc', args);
		proc.stdout.on('data', onOut = function (data) {
			stdout += data;
			if (self._v) console.log("STDOUT: " + data.toString())
		});

		proc.stderr.on('data', onErr = function (data) {
			stderr += data;
			if (self._v) console.log("STDERR: " + data.toString())
		});

		proc.on(_END_EVENT, function() { // _END_EVENT for dealing with older versions of node.js
			if (!!stderr) {
				return cb(new Error(stderr)); 
			}
			if (!!stdout) {
				return cb(new Error(stdout));
			}
			cb(undefined);
		});
	}
}


module.exports = ICC;


