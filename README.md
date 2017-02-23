# rigi-viewer-web
Reference implementation for a web-based Rigi integration

## Overview

Rigi provides an API for the integration with web-based translation tools. For that, the translation tool needs to

- Open the view for external tools in a popup window or iFrame
  - The URL is `https://<servername>.rigi.io/projects/<projectID>/context/signature/<signature>`
  - `<servername>` is the subdomain of the rigi server. 
  - `<projectID>` is the unique ID of the target project
  - `<signature>` is a hash value of the string ID that needs to be translated (or reviewed) in context. 
  - The URL is also part of Rigi XML and XLIFF exported by the server. 
- Connect to and communicate with the window via jsChannel. 
  - jsChannel is an abstraction on top of the HTML5 postMessage() API. 
  - It is available as an open-source library: https://github.com/mozilla/jschannel
- The translation tool can then exchange messages with the Rigi application through this channel. Please refer to the Channel API below.

## Channel API

### Create a channel 

First, you need to create a channel for the communication with the Rigi application: 

	let channel = Channel.build({
	  window: targetWindow,   // The popup window or iFrame that is used to display the Rigi application 
	  origin: "*",
	  scope: "rigiAPIScope",  // The name of the communication scope
	  reconnect: true,
	  onReady: () => {	
		// Register for notifications
		channel.bind("onStringSelected", (trans, signature) => {
		  // Will be called whenever the user selected a string in the Rigi preview. 
		});
		channel.bind("onPublishSignatures", (trans, signatures) => {
		  // Will be called whenever Rigi has detected new localizable texts in the current preview. 
		});
	  },
	  onError: err => { // Handle error }
	});


### Select a string

Whenever a string was selected in the translation tool, you can notify the Rigi application by passing the signature of the selected string. 

	channel.notify({
	  method: "select",
	  params: "12345" // The signature that was selected
	});

### Change translations

It is possible to change translations in the Rigi preview in real-time. 

	channel.notify({
      method: "translate",
      params: { signature: "1234", translation: "Hello world!" }
    });

This can be called when the user is typing in a translation or when all translations in the current preview should be changed. 

To change multiple translations in a single call, use `translateMany`: 

	channel.notify({
      method: "translateMany",
      params: { translations: [
        {signature: "1234": "translation": "test"}, 
        {signature: "5678": "translation": "test2"}, 
      ]}
    });

### Get notifications 

As described above, when the channel is created, the client can register for notifications. 

- `onStringSelected` 
  - This is called whenever the user selected a string in the Rigi preview, passing the signature of the selected string as parameter. 
  - Please note the `onStringSelected` is not called after the client has sent the select command. 
- `onPublishSignatures`
  - This is called whenever Rigi has detected localizable strings in the current preview. It passes an array with signatures (no duplicates) as parameter. 
   - At this point, the client may call `translateMany` to change all translations in the preview with the values currently stored in the translation tool. 

## How to run the sample application

### Prerequisites

- [Git](https://git-scm.com/)
- [Gulp](http://gulpjs.com/) (`npm install --global gulp`)

### Deploy

1. Run `npm install` to install all required dependencies

### Start

Run `gulp serve` to start the build.

### Use

1. Enter the project URL (`http://<domain>/projects/<projectID>`)
2. Enter the signature
3. Press `Start` button
4. You're done!
