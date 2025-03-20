# Mastering-Node.js-CH7

Modern web dev requires 3 components: backend server, client-side application, and the browser...

Now it is time to explore how the server-side part of the application has to work together with the other components.

This chapter covers two topics that shape the way parts of an application fit together. The first using a bundler, and then the use of a content security policy (CSP).

Bundler...

Client-side portion of app usually has a bunch of files and these are all gathered together and compressed into a smaller number of files for efficiecy: less requets! This is done by a bundler and most of the widely used client-side frameworks like Angular and React provide tools that use a bundler called webpack...

Content Security Policy (CSP)

Browsers are involved in web apps, and CSPs allow the browser to stop client-side JavaScript code from performing unexpected actions. CSPs describe the expected behavior of the client-side code to the browser. CSPs should really be used in conjunction with other measures like input sanitization. CSP are a really important defense against cross-site scripting (XSS), which is when an attacker tries to subvert the app to execute js code.

