const User = require('../models/user');
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");

const risks = ['Low', 'Moderate', 'High'];

module.exports.renderRegister = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/incomehack');
    }
    res.render('users/register', { risks });
}

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password, risk } = req.body;
        const user = new User({ email, username, risk });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to incomeHack!');
            res.redirect('/incomehack');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.renderLogin =  (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/incomehack');
    }
    res.render('users/login');
}

module.exports.renderUserDetails = async (req, res) => {
    const userid = req.user._id;
    const user = await User.findOne({ _id : userid } );
    res.render('users/userdetails', { user, risks })
}

module.exports.updateRisk = async (req, res) => {
    const userid = req.user._id;
    await User.findOneAndUpdate( { _id : userid }, req.body);
    res.redirect('/userdetails')
}

module.exports.updateEmail = async (req, res) => {
    const userid = req.user._id;
    await User.findOneAndUpdate( { _id : userid }, req.body);
    res.redirect('/userdetails')
}

module.exports.login =  (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/incomehack';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout =  (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/incomehack');
}

module.exports.renderForgot = (req, res) => {
    res.render('users/forgot');
};
  
module.exports.forgot = (req, res, next) => {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('/forgot');
          }
  
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAILPW
          }
        });
        var mailOptions = {
          to: user.email,
          from: process.env.EMAIL,
          subject: 'Node.js Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          console.log('mail sent');
          req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
          done(err, 'done');
        });
      }
    ], function(err) {
      if (err) return next(err);
      res.redirect('/forgot');
    });
};
  
module.exports.renderReset = (req, res) => {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      res.render('users/reset', {token: req.params.token});
    });
};
  
module.exports.reset = (req, res) => {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }
          if(req.body.password === req.body.confirm) {
            user.setPassword(req.body.password, function(err) {
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;
  
              user.save(function(err) {
                req.logIn(user, function(err) {
                  done(err, user);
                });
              });
            })
          } else {
              req.flash("error", "Passwords do not match.");
              return res.redirect('back');
          }
        });
      },
      function(user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAILPW
          }
        });
        var mailOptions = {
          to: user.email,
          from: process.env.EMAIL,
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ], function(err) {
      res.redirect('/incomehack');
    });
};