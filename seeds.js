const   mongoose    = require("mongoose"),
        Campground  = require("./models/campground"),
        Comment     = require("./models/comments");

const data = [
    {
        name: "Cotopaxi",
        image: "https://images.unsplash.com/photo-1534883274284-e49c17e8b345?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1442&q=80",
        description: "Lorem ipsum dolor amet brooklyn sartorial taxidermy, meggings af shabby chic XOXO try-hard polaroid sriracha ugh meh locavore 90's leggings. Art party blog brooklyn bushwick 8-bit DIY raw denim authentic hella before they sold out celiac. Church-key 90's austin umami beard thundercats. Locavore beard leggings enamel pin, before they sold out 90's brooklyn yr.",
        author: {
            id: "5cabf840038f243af0b8ccaa",
            username: "jorgenrique"

        }
    },
    {
        name: "Chimborazo",
        image: "https://images.unsplash.com/photo-1541388810897-3964fe779a8f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
        description: "Lorem ipsum dolor amet brooklyn sartorial taxidermy, meggings af shabby chic XOXO try-hard polaroid sriracha ugh meh locavore 90's leggings. Art party blog brooklyn bushwick 8-bit DIY raw denim authentic hella before they sold out celiac. Church-key 90's austin umami beard thundercats. Locavore beard leggings enamel pin, before they sold out 90's brooklyn yr.",
        author: {
            id: "5cabf840038f243af0b8ccaa",
            username: "jorgenrique"

        }
    },
    {
        name: "Los Altares",
        image: "https://d1bvpoagx8hqbg.cloudfront.net/originals/laguna-amarilla-volcan-el-altar-4-300-msnm-23a94434f8a4317ed49437b953f72cc7.jpg",
        description: "Lorem ipsum dolor amet brooklyn sartorial taxidermy, meggings af shabby chic XOXO try-hard polaroid sriracha ugh meh locavore 90's leggings. Art party blog brooklyn bushwick 8-bit DIY raw denim authentic hella before they sold out celiac. Church-key 90's austin umami beard thundercats. Locavore beard leggings enamel pin, before they sold out 90's brooklyn yr.",
        author: {
            id: "5cabf840038f243af0b8ccaa",
            username: "jorgenrique"

        }
    }
    
]

function seedDB() {
    Campground.deleteMany({}, (err) => {
        if (err) return console.log("fuck!! " + error)
        console.log("cleaned up dude");
    });
    data.forEach((post) => {
        Campground.create(post, (err, campground) => {
            if (err) return console.log(err)
            console.log(`${campground.name} is up dude!!!!`)
            Comment.create({
                text: "oh hell yeah",
                author: {
                    id: "5cabd8cbd249f9471423e262",
                    username: "sebasluke"
                }
            }, function(err, comment){
                if (err) console.log(err)
                campground.comments.push(comment)
                campground.save();
                console.log(`${comment.text} added to ${campground.name} by ${comment.author} bro!`);
            });  
        });
    });
};

module.exports = seedDB;