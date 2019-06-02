var mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment = require("./models/comments"),
    
    data = 
    [
         
        {
            name: "Cloud's Rest",
            image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
            description: "Its a cool camp tho"
        },
        
        {
            name: "Desert Mesa", 
            image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
            description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
        },
        
        {
            name: "Canyon Floor", 
            image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
            description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
        }
    
    ];
    
    
function seedDB()
{
    //Remove all CampGrounds
    // Campground.remove({}, function(err)
    // {
    //     if(err)
    //     {
    //         console.log(err);
    //     }
    //     else
    //     {
    //         console.log("Removed All campgrounds");
    //     }
    // });
    
    //Create a few more campgrounds
    data.forEach(function(seed)
    {
        Campground.create(seed,function(err, data)
        {
            if(err)
            {
                console.log(err);
            }
            else
            {
                console.log("Added a campground");
                //create a comment
                Comment.create(
                {
                    text: "This place is good",
                    author: "Homer"
                }, function(err, comment)
                {
                     if(err)
                     {
                           console.log(err);
                     }
                     else
                     {
                        //  console.log(typeof(comment))
                        //  console.log(comment);
                        data.comments.push(comment);
                        data.save(); //// YOUUU HAVE TO SAVE AFTER DOING THE PUSHHHHHHHHHHHHHH
                        console.log("Created new comment")
                     }
                });
            }
        });
    });
    
    
}
    
module.exports = seedDB;