if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const listingRoutes = require("./routes/listing");
const reviewRoutes = require("./routes/review");
const userRoutes = require("./routes/user");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const User = require("./models/user");
const localStrategy = require("passport-local");



const dbUrl = process.env.ATLASDB_URL;
// Connect to MongoDB
async function main() {
  await mongoose.connect(dbUrl);
}
main()
  .then(() => console.log(" Connected to MongoDB"))
  .catch((err) => console.error(" MongoDB connection error:", err));

// App Config
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));




const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
})

store.on("error",() => {
  console.log("error in MONGO store",err);
} )


// Session Configuration
const sessionOptions = {
  store,
  secret: process.env.SECRET ,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};



app.use(session(sessionOptions));
app.use(flash());

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware for flash and current user
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// Demo user route (for testing)
app.get("/demouser", async (req, res) => {
  let FakeUser = new User({
    username: "demo",
    email: "student@gmail.com",
  });
  let registeredUser = await User.register(FakeUser, "helloworld");
  res.send("Demo user created successfully!");
});
app.use("/listings", listingRoutes);         // listing routes
app.use("/listings/:id/reviews", reviewRoutes); // review routes mounted on /listings/:id/reviews
app.use("/", userRoutes);



app.get("/",(req,res) => {
  res.redirect("/listings");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});


// Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error", { message });
});

// Start Server
app.listen(8080, () => {
  console.log("🚀 Server running at http://localhost:8080");
});
