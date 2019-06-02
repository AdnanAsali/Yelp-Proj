var mongoose = require("mongoose");

//SCHEMA SETUP
var campgroundsSchema = new mongoose.Schema(
    {
        name: String,
        image: String,
        description: String,
        comments:
        [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment"
            }
        ]
    });

module.exports = mongoose.model("Campground", campgroundsSchema);


//This file is made for the schema in order to make the "app.js"
//file more organized and Clean.
