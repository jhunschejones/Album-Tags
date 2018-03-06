# This Week

## Objective
This is a fun little app I built to access the Apple Music API and display some information.

## Steps Taken
This is the second app I've built with the express-generator. Though it is currently serving mostly static content, I wanted the app to be ready for more dynamic content as I add more features. 

The greatest challenge of this app was the actual process of accessing the Apple Music API. I read the handbook on JWT's along with the full documentation on Apple's music api to figure out how to create the token I would need, and then how to include it in my api calls. The JSON that comes back from Apple takes a little bit of work to get into, so I used Postman to view the results of a call and figure out how to get to the properties of the object that I needed. 

Finally, I worked to build my express router and global.js files up so they could return, store, and use the data from my api calls to populate the page. 

## Outcome
To take a look at the final product, click [here](music-this-week.herokuapp.com)! I hosted the app on Heroku for practice deploying and maintaining a live application. I'm really proud of how this turned out and I'm excited to continue to add features to this application.