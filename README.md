# Music This Week

## Objective
This is a fun little app I built to access the Apple Music API and display some information.

## Steps Taken
This is the second app I've built with the express-generator. Though it is currently serving mostly static content, I wanted the app to be ready for more dynamic content as I add more features.

The greatest challenge of this app was the actual process of accessing the Apple Music API. I read the handbook on JWT's along with the full documentation on Apple's music api to figure out how to create the token I would need, and then how to include it in my api calls. The JSON that comes back from Apple takes a little bit of work to get into, so I used Postman to view the results of a call and figure out how to get to the properties of the object that I needed.

Finally, I worked to build my express router and global.js files up so they could return, store, and use the data from my api calls to populate the page. At this stage it may look like much of the functionality of the site could be duplicated by just hard-coding in the values, however the real power of Express and Node becomes apparent when the content needs to be updated. I can simply update the album ID in the global.js file and all the data on the page updates automatically, including the images. This flexibility expands the potential of the app for additional future features, and makes the weekly maintenance easy.

#### Update 1:
As I look to the future features I would like to bring to this app, I decided I would benefit from a different view engine and some of the features it offers. I converted the app from jade to ejs, and in the process took the oportunity to upgrade the bootstrap from v4 Alpha to the current stable 4.x now that v4 aplha is depreciated.

I really enjoy how easy it is to work with partials in ejs. It helped DRY up my code quite a bit and gives me a fast way to build more new views yet maintain content easily throughout the app.

#### Update 2:
I have pushed a few small updates over the past week, but the culmination of these changes is that there is now a "under-construction" home page with basic links through the site as well as a functioning tag database. The tag search functionality allows users to see what tags an album is associated with and find related albums by searching using one or more tags.

#### Update 3:
Over the last two commits I added an "update" page which allows a user to add and delete tags from an album in the database. The tags are stored as an array value in an album's document in the MongoDB database. Because of this, the update functionality had to be written as a PUT request, not just a POST request. I use two different functions in the page script file--one to add tags to an array and one to remove them, then the array is used in the final PUT request. Once this put functionality was in place, I also added a POST functionality that is used when the album is not in the tags database. This is necessary because the actual album details are called from Apple's API, so there are many more albums viewable in the app than are in the tags database.

## Outcome
To take a look at the final product, click [here](https://music-this-week.herokuapp.com/)! I'm hosting the app on Heroku for the added experience of deploying and maintaining a live application. I'm really proud of how this turned out and I'm excited to continue to add features to this application.
