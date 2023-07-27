import express from 'express';
// const dotenv = require('dotenv');
import bodyParser from 'body-parser';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import session from 'express-session';
import { AnecdotesService } from './anecdotes';

// dotenv.config();

passport.use(
  new LocalStrategy(function verify(
    username: string,
    password: string,
    cb: any,
  ) {
    console.log('in verify()');
    const user = { username };
    return cb(null, user);
    // return cb(null, false, { message: 'Incorrect username or password.' });
  }),
);

passport.serializeUser(function (user: any, cb) {
  cb(null, { username: user.username });
});

passport.deserializeUser(function (user, cb) {
  return cb(null, user as any);
});

const app = express();
const port = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  const homePage = `
  <h1>D'Erman Central</h1>
  <nav>
    <ul>
      <li><a href="/login">Login</a></li>
      <li><a href="/anecdotes">Anneddoti</a></li>
      <li><a href="/tree">Albero Genealogico</a></li>
  </nav>
  `;

  res.send(homePage);
});

app.get('/login', (req: express.Request, res: express.Response) => {
  const loginPage = `
  <h1>Sign in</h1>
  <form action="/api/login" method="post">
      <section>
          <label for="username">Username</label>
          <input id="username" name="username" type="text" autocomplete="username" required autofocus>
      </section>
      <section>
          <label for="current-password">Password</label>
          <input id="current-password" name="password" type="password" autocomplete="current-password" required>
      </section>
      <button type="submit">Sign in</button>
  </form>
  `;

  res.send(loginPage);
});

app.post('/api/login', (req, res, next) => {
  console.log('in /api/login');
  passport.authenticate('local', (err: any, user: any, info: any) => {
    console.log('in passport.authenticate()');
    if (info) {
      return res.send(info.message);
    }
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/login');
    }
    req.login(user, (err) => {
      console.log('in req.login()');
      if (err) {
        return next(err);
      }
      return res.redirect('/');
    });
  })(req, res, next);
});

app.get('/api/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.redirect('/');
    }
  });
});

app.get('/api/whoami', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`You are: ${JSON.stringify(req.user)}\n`);
  } else {
    res.status(403).send('Unauthorized');
  }
});

app.get('/api/anecdotes', async (req, res) => {
  const anecdotes = await new AnecdotesService('../data/anecdotes').readAll();
  res.json({ anecdotes });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
