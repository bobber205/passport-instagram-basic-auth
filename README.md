# passport-instagram-basic-auth

[Passport](http://passportjs.org/) strategy for authenticating with [Instagram](http://www.instagram.com/)
using the OAuth 2.0 API.

This module lets you validate a user's identitiy on Instagram using Facebook's Basic Auth for Instagram.
By plugging into Passport, Instagram Baisc Auth authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).


## Install

    $ npm install passport-instagram-basic-auth

## Usage

#### Create an Application

Before using `passport-instagram-basic-auth`, you must register an application with
Facebook then register a Instagram Basic Auth application.  If you have not already done so, a new application can be created at
[Facebook Developers](https://developers.facebook.com/).  Your application will
be issued an app ID and app secret, which need to be provided to the strategy.
You will also need to configure a redirect URI which matches the route in your
application.

#### Configure Strategy

The Instagram Basic Auth authentication strategy authenticates users using a Facebook
account and OAuth 2.0 tokens. You must supply the clientID

```js
passport.use(new InstagramStrategy({
  clientID: process.env.INSTAGRAM_CLIENT_ID,
  consumerSecret: process.env.INSTAGRAM_CLIENT_SECRET,
  callbackURL: process.env.INSTAGRAM_CALLBACK_URL,
  passReqToCallback: true
},
  function (request, token, tokenSecret, profile, done) {

  }));
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'facebook'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```js
app.get('/auth/instagram', passport.authenticate('instagram'));
app.get('/auth/instagram/callback', 
  passport.authenticate('instagram', { failureRedirect: '/register' }),
  function(req, res) {
    res.redirect('/'); //or wherever you want
});
```

## Examples

Developers using the popular [Express](http://expressjs.com/) web framework can
refer to an [example](https://github.com/passport/express-4.x-facebook-example)
as a starting point for their own web applications.

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2011-2016 Jared Hanson <[http://jaredhanson.net/](http://jaredhanson.net/)>