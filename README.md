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
The simplest approach is to change the URL to which the client-side js code sends requests. Edit client.js.

This is simple but it does require changes to the server-side part of the app. Browsers allow js code to make HTTP reqs only within the same origin, which means URLs that have the same scheme, host, and port as the URL used to load the js code. What we have done is we have made it outside the origin! Oh no! The URL is outside the allowed origin so out browser is going to block that request. The solution... The solution to this problem is to use Cross-Origin Resource Sharing (CORS)!!!

This will make the browser send an additional request to the target HTTP server to determine whether it will accept HTTP requests from the origin of the js code.

If we try running we see it fails on OPTIONS method which is known as the pre-flight request, which allows the backend server to indicate whether it will accept the request.

The response from the backend server did not include the Access-Control-Allow-Origin header, which would have indicated that cross-origin requests are allowed, therefore, the browser blocks the POST request. (pg 345).

To fix, lets install CORS package for Express and a package that describes the API it provides for the TypeScript Compiler

npm install cors@2.8.5
npm install --save-dev @types/cors@2.8.16

At this point our app still does not work, we must fix server.ts! All we have done is modify cilent.js.

Now we must go to server.ts and allow cross-origin requests.
Author typo here, server.TS should be server.ts. Email...

## Forwarding Requests from Webpack to the Backend Server

There are more sophisticated solutions than the one described in the previous section. A perhaps better one would be to configure the webpack dev server so it forwards requests to the backend server. The request forwarding is not apparaent to the browser, which means all requests are sent to the same origin and CORS is not required.

Edited webpack.config.mjs to add support for forwarding requests.

The proxy setting is used here to specify one or more paths and the URLs to which they should be forwarded.

Editing client.js to use relative URLs

So we made changes but webpack does not pick up changes to its config file automatically. So we have to stop it with control+C to stop the existing process and run npm start over again in the webapp folder to start webpack and the backend server again.

Go to http://localhost:5100, three click the send message button and the webpack server will receive the request and act as a proxy to get a response from the backend server.