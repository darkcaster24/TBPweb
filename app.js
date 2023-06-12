var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var docsRouter = require('./routes/docs');
var authRouter = require('./routes/auth');
const authMiddleware = require('./middleware/authMiddleware');

var app = express();

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/signatures')));
app.use(express.static(path.join(__dirname, 'views')));

app.set('view engine', 'ejs');
// Mencoba front end
app.use(express.urlencoded({ extended: false }));

// app.get('/inbox', (req, res) => {
//   res.sendFile(path.join(__dirname, 'views', 'inbox.html'));
// });

// app.get('/send', (req, res) => {
//   res.sendFile(path.join(__dirname, 'views', 'send.html'));
// });

// app.get('/home', (req, res) => {
//   res.sendFile(path.join(__dirname, 'views', 'home.html'));
// });

// app.get('/register',(req, res) => {
//   res.render('register');
// });

// app.get('/profil', (req, res) => {
//   res.sendFile(path.join(__dirname, 'views', 'profil.html'));
// });

// app.get('/review', (req, res) => {
//   res.sendFile(path.join(__dirname, 'views', 'review.html'));
// });

// app.get('/forgot-pass', (req, res) => {
//   res.sendFile(path.join(__dirname, 'views', 'forgot_pass.html'));
// });

// app.get('/pass-token', (req, res) => {
//   res.sendFile(path.join(__dirname, 'views', 'pass_token.html'));
// });

// app.get('/new-pass', (req, res) => {
//   res.sendFile(path.join(__dirname, 'views', 'new_pass.html'));
// });

app.post('/load-login', (req, res) => {
  const { email, password } = req.body;
  // Lakukan validasi email dan password di sini

  // Redirect ke halaman setelah login berhasil
  res.redirect('/dashboard');
});

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/docs', docsRouter);

// app.get('/', authMiddleware, (req, res) => {
//   res.json({ message: 'Welcome!' })
// })


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
