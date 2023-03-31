// NPM PACKAGES
require('dotenv').config();
const   express         = require('express'),
        chalk           = require('chalk'),
        path            = require('path'),
        mongoose        = require('mongoose'),
        passport        = require('passport'),
        LocalStrategy   = require('passport-local'),
        favicon         = require('serve-favicon'),
        User            = require('./models/user'),
        app             = express();

// ROUTES
const miscRoutes        = require('./routes/misc'),
      entryRoutes       = require('./routes/entry'),
      userRoutes        = require('./routes/user');

// MONGODB
mongoose.connect('mongodb://localhost:27017/myapp',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// EXPRESS SETUP
app.use(express.static('public'));
app.use(favicon(path.join(__dirname, 'public/assets/images', 'favicon.ico')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// EJS SETUP
app.set('view engine', 'ejs');

// PASSPORT CONFIG
app.use(require('express-session')({
    secret: "shhh",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ============================
// SERVER
// ============================
app.use(userRoutes);
app.use(entryRoutes);
app.use(miscRoutes);

app.get("/overview",(req,res)=>{
    res.render("/views/overview.ejs")
})

// app.get("/doctor",(req,res)=>{
//     res.render("/views/doctor.ejs")
// })

app.listen(3000, () => {
    console.log(chalk.green('Server is listening on PORT 3000'));
});