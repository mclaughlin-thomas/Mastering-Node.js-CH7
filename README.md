# Mastering-Node.js-CH7

Modern web dev requires 3 components: backend server, client-side application, and the browser...

Now it is time to explore how the server-side part of the application has to work together with the other components.

This chapter covers two topics that shape the way parts of an application fit together. The first using a bundler, and then the use of a content security policy (CSP).

Bundler...

Client-side portion of app usually has a bunch of files and these are all gathered together and compressed into a smaller number of files for efficiecy: less requets! This is done by a bundler and most of the widely used client-side frameworks like Angular and React provide tools that use a bundler called webpack...

Content Security Policy (CSP)

Browsers are involved in web apps, and CSPs allow the browser to stop client-side JavaScript code from performing unexpected actions. CSPs describe the expected behavior of the client-side code to the browser. CSPs should really be used in conjunction with other measures like input sanitization. CSP are a really important defense against cross-site scripting (XSS), which is when an attacker tries to subvert the app to execute js code.

## Packaging Client Files

The client-side of web apps is usually executed by a broswer, and the app is delivered as an html file that, in turn, tells the browser to request js files, css, and any other resource.

Sometimes, there can be a lot of js and css files, which means our browser has to make a bunch of HTTP requests for them all. Many projects use a bundler, which processes client-side assets to make them smaller and combine them into fewer files! The most popular bundler is webpack. Webpack can be used on its own or as part of the standard dev tools for frameworks like React or Angular. There are other bundlers out there too.

Bundlers really help the server-side of the project by concentrating the requests clients make for resources into fewer requests and smaller files. But! bundlers often need work to integrate  them with the project so that client-side and server-side development can be easily combined.

// Installing the bundler packages
npm install --save-dev webpack@5.89.0
npm install --save-dev webpack-cli@5.1.4
npm install --save-dev npm-run-all@4.1.5

## Creating Stand-Alone Bundles

The simplest way to use a bunder is a stand-alone tool.

To configure webpack, lets add a file webpack.config.mjs to the webapp directory.

This file uses js rather than json config file. The mjs extension specifies a js module, which allows us to use the import syntax.

This basic config files tells webapck to process the client.js file in the static folder and write the bundle it creates to a file in the static folder and write the bundle it creates to a file named bundle.js in the dist/client directory.

Updated html to use this bundle.js too.

## Using the Webpack Development Server

webpack also provides an HTTP server that streamlines the client-side development process and is really popular. 
The webpack dev server can be used for client-side dev alongside conventional server-side functionality.

To install the webpack development http server package

npm install --save-dev webpack-dev-server@4.15.1

After installing we have to edit:

webpack.config.mjs

package.json


The devServer defined over in webpack.config.js contains the settings for the HTTP server. the webpack server listens for HTTP reqs on the port we specified there (5100), and responds using the files in the directories specified in the static setting.

The key difference is that the bundle of js sent to the browser contains additional code that opens a persistent HTTP connection back to the dev server and waits for a signal.

When webpack detects that one of our files it is watching has changed, it will build a new bundle and send the browser the signal it has been waiting for, which then loads the changed content dynamically. This is known as live reloading!!!

After fixing up webpack.config.mjs we have to fix up package.json.

So we also can now edit the index.html and it will live reload. It is NOT a part of the bundle, but webpack watches files in the static fir in its config file and it triggers an update if they change.

http://localhost:5100/

Introducing a server just to serve the client-side code is problematic... This is because the webpack server has no means to respond to HTTP requests made by the client-side js code it bundles. Try clicking send message on:

http://localhost:5100/

It fails...

The next sections we will look at THREE dirrerent ways this problem can be solved. Not all approaches work in every project because client-side frameworks do not always allow the underlying webpack config to be changed or .... But all frameworks can be used with at least of these approaches. It is worth experimenting to find one that works and suits your development style.

## Using a Different Request URL
342