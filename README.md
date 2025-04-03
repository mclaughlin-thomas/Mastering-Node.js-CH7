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

## Forwarding Requests from the Backend Server to Webpack
The third approach is to switch the servers around so the backend server forwards requests to the webpack server. This method has the advantage of making the development environment more consistent with production and ensures the headers set by the backend server are applied. To do this we must install a proxy package for express.

npm install http-proxy@1.18.1

We now must edit server.ts to forward requests.

These changes enable the proxy, including support for dealing with web socket requests, which are used for the live reload feature, and which also must be forwarded to the webpack development server. We must also  update the required webpack config file to specify the URL that the client side live reloading will connect to.

We now must edit webpack.config.mjs.

Now, if we restart our app, and go to http://localhost:5000, we will have the backend server receive the request and still benefit from the features of the webpack development server.
We have used the backend server as a proxy for webpack.

## Using a Content Security Policy

CORS is an example of a set of request headers that were introduced to address malicious behavior by providing the browser with info about how the app is expected to work.

There are additional headers that the backend server can set to provide the browser with insight into how the application works and what behaviors are expected. The most important header is Content-Security-Policy, which the backend server uses to describe the application's Content Security Policy (CSP). Our CSP tells the browser what behaviors are to be expected from the client-side app so that it can block suspicious activity.

The use of CSPs is intended to prevent Cross-Site Scripting (XSS) attacks. Basically with XSS, attackers inject malicious content or code into the content displayed by the browser to perform a task NOT INTENDED BY THE APPLICATION DEVELOPERS. Typically it is something that steals sensitive info/data.

A common cause of XSS arises when an application accepts input from one user that is subsequently incorporated into the content presented to other users.

If an application accepts user reviews that are displayed alongside products, then for example, an attacker could craft a review that browsers interpret as HTML or js ontent when the product page is displayed.

We are going to do an example!

Adding element  to HTML, which allows user to enter data to later be displayed by the browser.

Now we have to update the client-side js to handle this new user field.

Now we also must update the handler, readHandler.ts that receives the data from the broswer so that it can pipe the data frmo the requests to the response.

This means that whatever is entered into the input element will be sent to the server and then piped back to the browser, where it will be displayed to the user.

The handler also sets a cookie in response.

Okay! So, one of the uses of XSS attacks is to steal session creds so an attacker can impersonate a legit user. The cookie set by the code in the changed we just made in readHandler.ts is a placeholder for data that will be stolen.

The changes made to the HTML, the client.js, and readHandler.ts deliberately creates a situation where input provided by the user is used without any form validation. This is a very common problem, XSS isone of the top 10 app security risks identified by OWASP.

## Injecting Malicious Content

Now time to inject malicious content.

Create badServer.mjs

This is the bad server that will serve content and receive requests on behalf of malicious code.

Code is expressed for brevity rather than readability there...

Lets start it with this command:

node badServer.mjs

## Defending a Content Security Policy

A CSP tells the browser how the client-side app is expected to behave and is set with the Content-Security-Policy header as seen in updated Server.ts.

This CSP header should be applied to every response, so... The listing uses the Express Use method to setup a middleware component that is used to pass the request along for further processing.

The header value is the policy for the application and consists of one or more policy directives and values.

The code in server.ts now contains one policy directive, which is img-src and whose value is self.

The CSP specification defines a range of policies that specify the locations from which different content can be loaded.

Useful CSP directives

default-src

connect-stc

img-src

script-src

script-src-attr

form-action

---------------------------------

The values for a policy can be specified using URLs with wildcards. Like:

http://*.acme.com

or a scheme like http: to allow HTTP requests or https: for all HTTPS requests.


## Using a Package to Set the Policy Header

It is possible to set the CSP header directly, but we can just use a package to help us out!

npm install helmet@7.1.0

Updating server.ts again but removing the 

Server.ts now has a CSP that will allow images to be loaded from the HTML docs domain, block all js in element attributes, restrict js files to the docs domain, and limit the URLs to which connections can be made by js code.

"This last directive specifies self , allowing HTTP connections to be sent to the backend server, but also includes the ws://localhost:5000 URL, which allows the connection required by the webpack live reload feature."

We get an error now w webpack. Lets change config now.

