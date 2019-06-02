        //Needed Libs
        var express     = require("express"),
            app         = express(),
            bodyParser  = require("body-parser"),
            mongoose    = require("mongoose"),
            Campground  = require("./models/campground"),
            Comment     = require("./models/comments"),
            seedDB      = require("./seeds"),
            passport    = require("passport"),
            LocalStrategy = require("passport-local"),
            User        = require("./models/user");
            
        // seedDB();
        mongoose.connect("mongodb://localhost/yelp_camp");    
        app.use(bodyParser.urlencoded({extended: true}));
        
        
        // PASSPORT CONFIGURATION
        app.use(require("express-session")(
        {
            secret: "This is the yelp camp proj and this should be encoded",
            resave: false,
            saveUninitialized: false
        }));
        app.use(passport.initialize());
        app.use(passport.session());
        passport.use(new LocalStrategy(User.authenticate()));
        passport.serializeUser(User.serializeUser());
        passport.deserializeUser(User.deserializeUser());

        app.set("view engine", "ejs");
        
        app.get("/", function(req, res)
        {
            res.render("landing");
        });
        
        //INDEX - show all campgrounds
        app.get("/campgrounds", function(req, res)
        {
            // get all campgrounds from DB
            Campground.find({}, function(err, allCampgrounds)
            {
               if(err)
               {
                   console.log(err);
               }
               else
               {
                res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
               }
            });
        });
        
        
        app.post("/campgrounds", function(req, res)
        {
            //get data from form and add to campgrounds array
            var name = req.body.name; // This comes from the form in the ejs file
            var image = req.body.image; // This comes from the form in the ejs file
            var desc = req.body.description; // This comes from the form in the ejs file
            var newCampGround = {name: name, image: image, description: desc};
            
            //redirect to campgrounds page
            res.redirect("campgrounds");
        });
        
        
        app.get("/campgrounds/new", function(req, res)
        {
            res.render("campgrounds/new");
        });
        
        
        app.get("/campgrounds/:id", function(req, res)
        {
           //Find the campground with the provided ID
           //Render show template with that campground
           
           Campground.findById(req.params.id).populate("comments").exec( function(err, foundCampground)
           {
              if(err)
              {
                    //render show template with that campground
                    console.log("Error");
              }
              else 
              {
                  console.log(foundCampground);
                    res.render("campgrounds/show", {campground: foundCampground});
              }
           });
        });
        
        
        
        // =================
        // COMMENTS ROUTES
        // =================
        
        app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res)
        {
            //Find campground by id
            Campground.findById((req.params.id), function(err, campground)
            {
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    res.render("comments/new", { campground: campground });
                }
                
            });
            
        });
        
        app.post("/campgrounds/:id/comments", function(req, res)
        {
            console.log("before the findById method");
            
            //lookup campground using ID
            Campground.findById(req.params.id, function(err, campground) 
            {
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    console.log("before Creation of comment");
                    //create new comment
                    Comment.create(req.body.comment , function(err, comment)
                    {
                        if(err)
                        {
                            console.log(err);
                        }
                        else
                        {
                            campground.comments.push(comment);
                            campground.save();
                            res.redirect("/campgrounds/" + campground._id);
                        }
                    });
                    //connect new comment to campground
                    //redirect to the show page of the campground
                }
            })
        });
        
        
        // =================
        // AUTHENTICATION ROUTES
        // =================
        
        
        /* SIGN UP ROUTES */
        //GETTING SHOW SIGN UP FORM
        app.get("/register", function(req, res)
        {
            res.render("register");
        });
        
        // HANDLING USER SIGN UP
        app.post("/register", function(req, res)
        {
            //WE MAKE A NEW USER OBJECT THAT ISNT SAVED TO THE DB YET SO WE ONLY PASS IN THE USERNAME
            //SO WE DONT SAVE THE PASSWORD IN THE DB ITS NOT A GOOD IDEA
            //SO WE PASS THE PASSWORD AS AN ARGUMENT AND THE FUNCTION OF  " REGISTER " WILL HASH THE PASSWORD
            //WHICH MEANS THAT IT WILL CHANGE THE PASSWORD INTO HUGE STRING INTO NUMBERS AND LETTERS
            //THEN STORES IT INTO THE DB IF WE PASSED IT INSIDE THE OBJECT IT WONT BE HASHED AND IT WOULD BE STOLEN
            User.register(new User({username: req.body.username}), req.body.password, function(err, user)
            {
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    //THE AUTHENTICATE METHOD ALLOWS THE USER TO TO ACTUALLY SIGN UP AND SAVE THEIR DATA INTO THE SESSION
                    //AND DEAL WITH THE FUNCTIONS OF SERIALIZE AND DESERIALZE AND ENCODE AND DECODE
                    //AND THE "LOCAL" ARGUMENT IS THE STRATEGY THAT WE are using
                    passport.authenticate("local")(req, res, function(err)
                    {
                        if(err)
                        {
                            console.log(err);
                        }
                        else
                        {
                            res.redirect("/campgrounds");
                        }
                    });
                }
            });
            
        });
        
        /* LOG IN ROUTES */
        app.get("/login", function(req, res) 
        {
            res.render("login");
        });
        
        
        //LOGIN LOGIC
        app.post("/login", passport.authenticate("local", // this is a middleware
        {
            successRedirect: "/campgrounds",
            failureRedirect: "/login"
        }) ,
        function(req, res)
        {
            console.log( "From the log in post route" + req.isAuthenticated());
        });
        
        /* LOG OUT ROUTES */
        app.get("/logout", function(req, res) 
        {
            req.logout();
            res.redirect("/");
        });
        
        
        function isLoggedIn(req, res, next)
        {
            if(req.isAuthenticated())
            {
                return next();
            }
            res.redirect("/login");
        }
        
        
        
        app.listen(process.env.PORT, process.env.IP, function()
        {
            console.log("Yelp Server is CONNECTED");
        });
        
        
        
        