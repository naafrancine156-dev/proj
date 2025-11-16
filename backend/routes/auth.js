const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const jwt = require('jsonwebtoken');

const router = express.Router();

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    // Save user to database or find existing user
    const user = {
      googleId: profile.id,
      email: profile.emails[0].value,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName
    };
    return done(null, user);
  }
));

// Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:5000/api/auth/facebook/callback",
    profileFields: ['id', 'emails', 'name']
  },
  async (accessToken, refreshToken, profile, done) => {
    const user = {
      facebookId: profile.id,
      email: profile.emails[0].value,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName
    };
    return done(null, user);
  }
));

// Google Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const token = jwt.sign({ userId: req.user.id }, process.env.JWT_SECRET);
    res.send(`
      <script>
        window.opener.postMessage({ token: '${token}' }, 'http://localhost:3000');
        window.close();
      </script>
    `);
  }
);

// Facebook Routes
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback',
  passport.authenticate('facebook', { session: false }),
  (req, res) => {
    const token = jwt.sign({ userId: req.user.id }, process.env.JWT_SECRET);
    res.send(`
      <script>
        window.opener.postMessage({ token: '${token}' }, 'http://localhost:3000');
        window.close();
      </script>
    `);
  }
);

router.post('/social-login', async (req, res) => {
  try {
    const { email, firstName, lastName, provider, uid } = req.body;

    // Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      // NEW USER - Create account
      user = await User.create({
        email,
        firstName,
        lastName,
        [`${provider}Id`]: uid,
        role: 'user' // default role
      });
    }
    // If user exists, just login (no need to create)

    // Generate token
    const token = jwt.sign(
  {
    id: req.user._id || req.user.id,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    email: req.user.email,
    role: req.user.role || "user"
  },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
  );


    res.json({ 
      token, 
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;