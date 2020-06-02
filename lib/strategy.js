const querystring = require('querystring');
const request = require("request");

// console.log("Initializing Passport", `ChirpifyInstagram`);

/**
 * Module dependencies.
 */
var util = require('util')
  , OAuth2Strategy = require('passport-oauth2')
  , InternalOAuthError = require('passport-oauth2').InternalOAuthError;


/**
 * `Strategy` constructor.
 *
 * The Instagram authentication strategy authenticates requests by delegating to
 * Instagram using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Instagram application's client id
 *   - `clientSecret`  your Instagram application's client secret
 *   - `callbackURL`   URL to which Instagram will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new InstagramStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/instagram/callback'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://api.instagram.com/oauth/authorize';
  options.tokenURL = options.tokenURL || 'https://api.instagram.com/oauth/access_token';
  this.scopes = options.scopes || ['user_profile']

  options.authorizationURL = `${options.authorizationURL}?&scope=${this.scopes.join(',')}&response_type=code`
  // console.log("Oauth 2 Strat options are", options);
  OAuth2Strategy.call(this, options, verify);
  this.name = 'instagram';
  this._oauth2.getOAuthAccessToken = function (code, params, callback) {
    // console.log("INSIDE getOAuthAccessToken", code, params);

    var params = {
      'client_id': process.env.INSTAGRAM_CLIENT_ID,
      'client_secret': process.env.INSTAGRAM_CLIENT_SECRET,
      'code': code,
      'grant_type': 'authorization_code',
      'redirect_uri': options.callbackURL
    }

    // console.log("PARAMS ARE", params)

    var post_data = querystring.stringify(params);
    var post_headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    this._request("POST", this._getAccessTokenUrl(), post_headers, post_data, null, function (error, data, response) {
      // console.log("access token error", error);
      // console.log("data is? ", data);
      if (error) callback(error);
      else {
        var results = JSON.parse(data);
        var access_token = results.access_token;
        callback(null, access_token, null, results);
      }
    });

  };
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);


/**
 * Retrieve user profile from Instagram.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `instagram`
 *   - `id`               the user's Instagram ID
 *   - `username`         the user's Instagram username
 *   - `displayName`      the user's full name
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function (accessToken, done) {
  // TODO: Instagram provides user profile information in the access token
  //       response.  As an optimization, that information should be used, which
  //       would avoid the need for an extra request during this step.  However,
  //       the internal node-oauth module will have to be modified to support
  //       exposing this information.

  let access_token_url =  `https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`;
  // console.log("Getting User Profile", access_token_url);
  
  request.get(access_token_url, (error, response, body) => {
    if (error) {
      done(error)
    } else {
      let json = JSON.parse(body);
      json.social_user_id = 
      console.log("got user data", json)
      done(null, json)
    }
  })
}


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;