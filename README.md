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

s