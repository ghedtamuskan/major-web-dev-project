if (process.env.NODE_ENV != "production"){   //31
require ('dotenv').config();
}

//1 requiring things
const express = require("express")
const app = express();
const path= require ("path");  //provide utility for working with file
const mongoose = require ("mongoose");
const methodOverride=require("method-override")
const ejsMate = require("ejs-mate")    // helps in create layouts and templates
const ExpressError = require("./utils/ExpressError.js")
const session = require("express-session") // to store important info
const MongoStore = require("connect-mongo") //33 mongo session
const flash = require("connect-flash") // to flash message
const passport = require ("passport")  //authentication middleware 
const LocalStrategy = require("passport-local")
const User = require("./models/user.js")

const listingRouter = require("./routes/listing.js") // 19 using express.router
const reviewRouter = require("./routes/review.js") //20 using express.router
const userRouter = require("./routes/user.js")   //23 signup user -GET
const dbUrl = process.env.ATLASDB_URL;

//2 starting server
app.listen(8080,()=>{
    console.log("server is listening to port 8080")
})
// app.get("/",(req,res)=>{
//     res.send(" root working..")    //api
// })  

// 3 mongoose set up
main()
.then(()=>{
    console.log("connected to DB ")
})
.catch(err=>{console.log(err)})

async function main(){
    await mongoose.connect(dbUrl)
   }

//4 setting for ejs files 
app.set ("views",path.join(__dirname,"views"))
app.set ("view engine","ejs")
app.use(express.urlencoded({extended:true})) //to parse POST data
app.use(methodOverride("_method")); // to parse put/ delte request
app.engine('ejs',ejsMate); //shortcut for boilerplate code
app.use(express.static(path.join(__dirname,"/public")))
app.use(express.json());  // Middleware to parse JSON request bodies

//5 in listing.js ,6 in listing route sample url
//7 in data.js 8,9 in index.js(init folder)

//11 in index.ejs (to show all listings)

// 10 , 12 to 16  ,17.4 ,18.2,18.3 18.6 in routes folder listing.js using express.Router

const store= MongoStore.create({    //mongo session store function
    mongoUrl: dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
})
store.on("eroor",()=>{
    console.log("ERROR IN MONGO SESSION STORE",err)
})

const sessionOptions = {               //20 express-session
    store,
    secret : process.env.SECRET,
    resave:false,
    saveUninitialized : true,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:7 * 24 * 60 * 60 * 1000,
        httpOnly:true
    }
}



app.use(session(sessionOptions))
app.use(flash());               //21 connect-flash

// 22 configuring passport local strategy
app.use (passport.initialize())
app.use (passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//21 flash-msg
app.use((req,res,next)=>{
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user
    next()
})
//22
app.get ("/demouser",async(req,res)=>{
let fakeUser = new User({
    email:"student@gmail.com",
    username : "delta-student"
})
  let registeredUser = await User.register(fakeUser,"helloword")
  res.send(registeredUser)
})

app.use("/listings",listingRouter) //19     always after flash and session
app.use("/listings/:id/reviews",reviewRouter) //20
app.use("/",userRouter) //23 signup user

// 17 ExpressError define
// Redirect root "/" to "/listings"

app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found !!"))
})

//error handler
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"} = err;
    res.status(statusCode).render("error.ejs",{message})
})














