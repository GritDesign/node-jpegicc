# node-jpegicc v1.0.0

Wrapper for Little CMS JpegICC tool for stripping color profiles and changing image colorspace.

## Basic Usage

```
var ICC = require("ICC");
var icc = new ICC();

icc.intent(2);
icc.quality("90");
icc.blackpointCompensation(true);
icc.process("test.jpg", "testout.jpg", function(err) {
	if (err) {
		console.log("JPEG ICC returned an error:");
		console.log(err);
		return;
	}
	console.log("Succesfully processed test.jpg");
});
```

## Installation

    npm install node-jpegicc

Also make sure jpegicc is installed.  See [Little CMS](http://www.littlecms.com/download.html) for binaries and a link to SourceForge, or download directly from [SourceForge](http://sourceforge.net/projects/lcms/files/lcms/2.5/lcms2-2.5.tar.gz/download)

They have precompiled binaries for some systems, if yours is not on the list or you prefer building manually:

    ./configure
    make
    make install

Or on a MAC with Homebrew

    brew install littlecms

## API Overview

Create a new ICC object

    var ICC = require("ICC");
    
Apply any optional arguments with getter/setters (pass null to clear)

```    
inputProfile                 <--  Input profile (defaults to sRGB)
outputProfile                <--  Output profile (defaults to sRGB)
intent                       <--  Intent (0=Perceptual, 1=Colorimetric, 2=Saturation, 3=Absolute)
blackpointCompensation       <--  Black point compensation (boolean)
preserveBlack                <--  Preserve black (CMYK only) 0=off, 1=black ink only, 2=full K plane
ignoreEmbeddedProfile        <--  Ignore embedded profile (boolean)
embedDestinationProfile      <--  Embed destination profile
saveEmbeddedProfile          <--  Save embedded profile as <new profile>
precalculatesTransform       <--  Precalculates transform (0=Off, 1=Normal, 2=Hi-res, 3=LoRes) [defaults to 1]
softProofProfile             <--  Soft proof profile
softProofIntent              <--  SoftProof intent
markOutOfGamutColors         <--  Marks out-of-gamut colors on softproof
quality                      <--  Output JPEG quality (0 - 100)
observerAdaptationState      <--  Observer adaptation state (abs.col. only)
verbose                      <--  (NOT the JpegICC verbose) Outputs debug information to console
 ```  

Execute the command

```
process	(source, destination, cb = function(err) {} );
```
