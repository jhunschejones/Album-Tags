# Album Tags (LEGACY README v0.0 - v1.2)

*Read more about the project below or go straight to the [live site](https://www.albumtags.com/) to try it for yourself!*

## Objective
I have been a musician and music fan for many years. For one reason or another, I've always prefered to approach an album or an EP as a single unit of art, rather than 6-12+ individual pieces of art. As streaming music services started to grow in popularity, I found that much of their functionality was geared towards songs; playlists, favorites, sharing, etc. This left me without a consistent way to keep track of all the great new records I now had access to through services like Apple Music. I found myself starting to 'discover' albums while researching that were already be saved in my music library.

My goal with Album Tags was to build a user-friendly web app that would allow people like me to access music data from the Apple Music and curate our own custom tags, connections, and favorites lists. Users can search by album or artist, view album details, search by the tags associated with one album, or view all tags and search by any combination of tags. They can also create an ever-changing list of favorite albums, and build connections between albums so they never have to forget a great record again.

## Steps Taken

### Iteration One
The first challenge in building this app was the actual process of accessing the Apple Music API. I read the full documentation handbook on JWT's along with the full documentation on Apple's music api to figure out how to create the token I would need and how to include it in my api calls. The JSON that comes back from Apple takes a little bit of work to dig into, so I used Postman to view the results of a call and figure out how to access to the properties of the object that I needed.
  
I started with a static 'music-this-week' page that displayed five albums selected by myself and hard-coded into the app. This helped me decide what information I wanted to display and how to use string manipulation to clean it up for display. From there I created the album details page, which displays additional data and a card for the tags associated with each album. A fun challenge during this step was writing my own function to display a cleanly written out date for the album release instead of the yyyy-mm-dd format returned in the JSON object coming from Apple.
  
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    function makeNiceDate(uglyDate) {
        let year = uglyDate.slice(0, 4);
        let day = uglyDate.slice(8, 10);
        let uglyMonth = uglyDate.slice(5, 7); 
        let niceMonth = months[uglyMonth-1];
        return(`${niceMonth} ${day}, ${year}`);
    };
  
From there I added the first version of an 'album details' page that showed an album cover, band name, album name, release year and record company. I also created a 'search' page that returned the top five matching albums and artists using the Apple Music Search API. To create the first of the interactive features in my roadmap, I then built out a MongoDB database that could store the custom tags I would use to describe each album. The first data structure for a tag looked much like this:

    {
        { 
            "id" : "xxxxxxxx" 
        },
        {
            "albumId" : "1086809505",
            "tags" : ["2016", "Metalcore", "Djent"]
        }
    }


I also created the 'update' page, linking the tags database with input fields so myself and other admin users could start to add tags to albums. The update page uses a PUT request to add new tags since each tag is not its own document, and a POST request if the album ID is not already in the tag database. I included the first version of the data validation on this page to help enforce a standard format of capitalization and a way to handle special characters for tags. 
  
Once the 'update' and 'album details' functionality was working, I created the search by tags functionality that allowed the user to select tags on the album details page and search for other albums that have the same combination of tags. I am really proud of the way the page allows a user to toggle tags, changing their display and adding/removing them from a 'selected tags' array in preparation for their search. Here is a piece of the code that I first used to enable that functionality: 

    function changeClass(tagName) {
        
        event.preventDefault();
        var thisTag = document.getElementById(tagName.id);
        thisTag.classList.toggle("badge-primary");
        thisTag.classList.toggle("selected_tag");
        thisTag.classList.toggle("badge-light");

        addToTagArray(thisTag.innerHTML);
    };

    var selectedTags = [];
    function addToTagArray(tag) {
        if ($.inArray(tag, selectedTags) === -1) {
            selectedTags.push(tag);
        } else {
            let index = selectedTags.indexOf(tag)
            selectedTags.splice(index, 1);
        };
    };
  
I updated my call to Apple's search API so that it returned the top 25 albums and artists, with logic in my script file to first show the top 5 then offer an option for the user to expand the list if desired. I also included a button to show the top five albums for each artist from within the artist list, and added some error handling to keep the script running if there are less than five results for any category. Finally, because I was now using tags as URI parameters, I added additional data validation and manipulation to make sure all the tags were stored as URL-safe strings, while being displayed as the tag's author intended.

    // using regular expression to make first letter of each
    // word upper case, even if it is separated with a "-"
    function toTitleCase(str) {
        return str.replace(/\b\w+/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }

    // removes accidental double spaces
    function removeExtraSpace(str) {
        return str.replace(/\s\s+/g, ' ');
    }

    // replaces back slash with underscore
    function replaceBackSlashWithUnderscore(str) {
        return str.replace(/\//g, '_');
    }

    function replaceUnderscoreWithBackSlash(str) {
        return str.replace(/_/g, "/");
    };
  
The final major feature I added in the first big version of the app was an 'all-tags' page, which displays every tag in the MongoDB database and allows a user to select and search by any single or combination of tags. Much of this page's functionality is still present in the current version of the app, and I am sure that is due to the simplicity with which the the 'all-tags' page was first written.
  
With the first full-featured version of the app functional, I encountered my first big bug to overcome. As I tested the app with users, I discovered a bug that created a long TTFB time when requesting data from Apple's api's. I reviewed my code with a senior developer and cleaned up some syntax and formatting. It turned out that this was the cause of an occasional malformed GET request that caused the response to take longer to come back than the rest of my requests. This infrequency made the bug very hard to replicate, but a balance of patience and curiosity really paid off in finding the cause. I've taken this problem-solving mindset forward into my standard coding practices, and it may be one of the most useful tools I've sharpened while building this app.

### Iteration Two
As I continued to use Album Tags with my friends, I always had the idea in the back of my mind that I wanted to find a way to make the features we were using accessible to everyone. I started calling this feature 'user-tags' and began working towards it in baby steps, iterating with each major version of the app. In what would be the first of a few data-structure rewrites, I adjusted the tag data-structure to include a second array of 'authors' where the index would correspond to the index in the tags array to describe who created each tag. Though this functionality was still limited to my hand-picked admin group, I wanted a way to keep track of who was adding which tags so that we could better understand their meaning. The second version of the 'tags' data structure looked similar to this:

    {
        { 
            "id" : "xxxxxxxx" 
        },
        {
            "albumId" : "1086809505",
            "tags" : ["2016", "Metalcore", "Djent"].
            "authors" : ["Joshua Jones", "Joshua Jones", "Miles Johnson"]
        }
    }

After attending a meetup where a Firebase employee spoke about the many features their platform offered, I built a couple test apps and decided Album Tags would be a great use-case for some of these developer-focused tools. I started with user authentication, allowing users to sign in with google and writing a custom user auth script to check a users credentials against a list of users who I wanted to have access to the 'update-tags' functionality.

This basic security feature allowed me to make the 'update-tags' page more easily accessible from the 'album-details' page while simultaneously gaining more control over who had access to this crucial functionality. I did this by displaying an 'update' button only to users who were on my admin list, and hiding it in the DOM for all other users, signed in or otherwise. During this second main iteration of the app, there wasn't really anything a user could do when they were signed in that they couldn't do otherwise. I opted to add this feature before proceeding though, because I knew a way to uniquely identify each user would be required to add any of the other interactive features I had in mind.

### Iteration Three
The third major update to the app was also completed using Firebase and it was a 'user-favorites' page. Now that I had a way to track users when they were signed in, I added a Firebase realtime database to store a simple array of album ID's accessible only by that user. I wrote new functionality based on the layout of my original 'music-this-week' page that populated new cards displaying basic album data for each album in this user-favorites array. I did this again using string manipulation so that I could pull data from Apple each time the page loaded, instead of storing pre-populated full pages with user favorites.

This was also a first taste of some UI development that I would later push further to continue to customize and optimize the layout of the app. I created icons for *favorited* and *unfavorited* that would populate on the 'album-details' page. I used a tooltip to explain what these did, but my goal was to make the button intuitive enough that users could just assume that it meant add or remove from favorites, depending on whether it was a full-icon or an outline-icon.

Since I now had my own favorites array, I rewrote what had previously evolved from the 'music-this-week' to an 'our-favorites' page to use the same functionality. This allowed me to add new albums to my favorites and they would be visible for all users of the site. To make the 'my-favorites' page even more powerful, I wrote some filters that allow users to filter by genre, release year, and artist name. This functionality really helped the favorites list to remain just as useful even as it grew in length. I also added a 'top-10' feature that would allow myself and admin users who had access to add tags to use a 'Top-10' tag to indicate that a record was in their top 10. If this tag was present in the tags database, the my-favorites page could then show a custom top-10 icon to allow the user to also sort but just albums in their top 10.

### Iteration Four
In the fourth main version of the app, I had the luxury of having now spent much longer actually using the app in production. I knew there were things I wished it had or functions that I wished it could perform better. I drew out a game plan and started to add in several bigger features one after the other. First, I added a 'connections' functionality that allowed users to directly connect one album to another. This had been the original intention of the 'tags' functionality, but in using the app I found myself often wanting to directly connect two albums in a one-to-one relationship without having a specific 'tag' in mind to do so. Just as importantly, connections was the first feature that would now let users start to express meaningful relationships between albums that could be displayed on the 'album-details' page. 

The data for the connections database was originally modeled as arrays with two values in them. This allowed me to model a connection as a single object that could be used to display the connected albums on the 'album-details' page for both albums. After a short time of using this feature, I realized that despite the convenient simplicity of this model, it would not allow for the app display connections from other users besides the user who was signed in. In order to achieve this, I restructured the connections functionality as well as the database to model a connection as two objects:

    "1110970296" :
    {
        "albumId" : "1086809505"
        "author" : "xxxxxxxx"
    }
    
    "1086809505" :
    {
        "albumId" : "1110970296"
        "author" : "xxxxxxxx"
    }
    
I then added a toggle switch so users could decide if they wanted to see all connections for an album, or only the ones they had created. The feature used session storage to temporarily keep track of the users preference from one 'album-details' page to another.

Having completed my biggest data restructure to-date, I next tackled the feature I'd been planning from the very beginning of Album Tags: 'user-tags.' Since the previous version of the app, I had been collecting information on which of my admins created which tags in the app. I was able to update this functionality to collect user-id's instead of just names, allowing for a similar display to what I had created with 'connections.' Users could now sign in, add their own tags, and toggle between their tags and tags created by other users on the 'album-details' page. Additionally, because the 'tags' array remained the same as the initial two data-structures, the 'all-tags' page and 'tag-search' functionality continued to work across the app without any modification!

Next, in what I thought would be my final big update to the app, I added several new UI features to improve the overall experience of bouncing around the application. I made a modern dropdown 'hamburger' menu for small screens and a full-width menu for desktop and larger screens. I added helpful 'home' and 'about' pages with easy to read instructions and quick-start buttons. I also added background images and built in custom breakpoints and changing icons to make the app feel just as friendly on desktop and mobile screens. 

With the app polished and looking much more inviting, I instrumented both the back-end code and front-end code with New Relic application monitoring software. This was a great learning experience and helpful tool to catch errors during users sessions and explore ways to improve the efficiency of my code and content delivery. Interestingly, shortly after all these updates, New Relic Browser started to surface a JavaScript error from my favorites page that was occuring reliably for a few days. When I dug into the issue further, I found that the Apple album id assigned to an album in my favorites had changed. In constructing the application to this point, I had been operating on the assumption that these values were static and would follow an album for it's entire lifespan.

I quickly realized that the potential for album id's to change meant that I was going to need to make some drastic changes to how I was storing data in my app. It was not hard to update an album ID in a single NoSQL document, but by the time I discovered an album id had changed, it could be very hard to reverse engineer which album that ID had been assigned to since it no longer meant anything to Apple. I worked on several solutions to this issue, and eventually realized that if I wanted my data structures to be as future-proof as possible, I would need to store additional information like the artist and album names *everywhere* that I was storing an Apple album ID.

I embarked on a four-day coding frenzy where I spent every free moment writing code to migrate my three current databases to match the new data structures I would need to avoid this 'lost-album' problem in the future. In the 'tags' database, I decided to keep the tags array but replace the authors array with an array of objects. Each object would have the name of the tag, the user ID of the author, the album name, and the band name. This required a rewrite of some portions of the functionality that displayed tags on the 'album-details' page, as well as the data structures imposed on the 'update' page. A nice upside of the tags data structure update was that I could correct tags that had been stored in two previous formats to all match my new format. This allowed me to remove some messier problem-solving code I had been using while building the 'album-details' page, solving two problems at once!

I followed the tags data structure update with similar updates to the favorites database and the connections database. Both of these used Firebase's Realtime Database so it was easier to export and restore code throughout the migration process while perfecting the code to make the updates. In the end, the shiny new version of Album Tags functions exactly as intended and is now much more impervious to user data loss if Apple were to change the album ID associated with any album a user has favorited, tagged, or connected!

### Iteration Four, Part II: User Experience and Security Updates
Prior to the fifth iteration of the application, I preformed some optimizations and updates using a staging version of the site to apply some new concepts and tools I was using in other projects. Below are some hi-lights of this update:

1. All the back-end routes for the app were refactored. Database and external calls were pulled out of the routes for each page where they previously lived, and were placed in the `api.v1.route.js` route. All client JavaScript files were also updated with these new endpoints. This allowed for removal of some duplicate code and easier updates for future backend changes.
2. The `www` file was updated to take advantage of Node's *Cluster* functionality. This allows my single Heroku dyno to serve up several instances of the application at once. As a result, the site should now be able to handle simultaneous requests quicker while making better use of the multi-core resources available on the Heroku dyno. 
3. The `POST` endpoint was removed and instead `{ upsert: true }` was added to the PUT endpoint so that if a record does not exist for an album it will create a new one. The client-side update script was also been updated so that it does not POST place-holder records when the page is accessed. This not only simplifies the code, it helps users on a slower connection because the update page does not have to wait for the `POST` request to finish before adding a new record.
4. The app will now send a custom event and metric to New Relic when a worker dies, triggering an alert. There will need to be more work around making sure relevant data about the cause of a worker crash is available but this is the first step in gaining visibility into the cluster process. Though it is an advantage to be able to spin up a new worker when the app crashes without the user being aware, it does mean a larger problem could exist without the developers knowing.
5. Some security changes were also made as a part of this update process. These include data validation to the `PUT` API endpoint to prevent cross-site scripting and additional functionality on the client side to safely parse data before appending it to the DOM. The approach I took was replacing special characters with their HTML equivalents. This prevents malicious content from affecting the page but doesn't affect how the content looks if special characters were intended by the user. I also added functionality to the `PUT` Ajax to check for scripting-attempts.
6. As a performance improvement, a counter was added to the `PUT` functionality so that if a new tag doesn't load after being added, the API is called a limited amount of times before the page is automatically refreshes *(previously there was no limit!)* This addresses the original goal of providing a seamless experience on slow networks, while simultaneously being judicious about how many API polling-calls the front end will make. Finally, it adds the step of refreshing the page when the update after a `PUT` request is not succeeding due to an *extra* slow network.

## Iteration Five:
After an ongoing to battle with some strange front-end page delays that were being captured by the New Relic Browser agent but in an infrequent pattern, I put together a plan for a fifth iteration of the application, with an official version change to v1.1. It became clear to me that as the application architecture and scope had evolved, it had grown in complexity to a point where a delay in one call could cause a cascading delay resulting in about one page load every couple days where the page would just hang for ten or more seconds. There were several important factors that I wanted to address with this iteration, so that the conclusion would be an Album Tags site that could run for the near future with improved reliability and minimal ongoing maintenance.

1. The application should use an MVC architecture for cleaner code organization and easier upgrades in the future
2. There should be at least *some* test coverage for API controllers and helper methods
3. Data sources should be streamlined to both: A. reduce the total number of API calls each page made and B. provide a more reliable back-end service
4. Database calls should be able to handle simultaneous user updates on the same document without failing

Beyond the basic re-writing of the Node app, models, and routes, the big lift of this iteration was re-thinking how the data could be best modeled to serve these new goals. In past iterations, new features frequently came with a new data source, such that at the end of the fourth iteration, some pages connected with 4 different databases *plus* the Apple Music API. To start with, I decided it would make for the cleanest code if I could return to having the *Album* as the central data model. To do this, I first added attributes for some of the recurring information that was being pulled from Apple to populate album details in the UI. This eliminated extra Apple API calls for albums that were already in the database. I then added connections and favorites as attributes of an *Album,* instead of making them their own data model. `favoritedBy` was added as an array of user ID's who had favorited that *Album* and connections were added as an array of JSON objects. The connection objects were also expanded to now contain all the required display data to eliminate Apple API calls that were being made to populate connected album information on the `albumdetails` and `update` pages. 

Using test driven design to build helper functions in my controllers, and eventually basic integration tests of the Apple API connections, helped add a layer of stability to the new architecture. In a matter of seconds I could now confirm that all my helper functions were still working as designed and that the Apple API settings were still accurate. In the past these were manual smoke-tests at best, and at worst had to be caught in production when a page didn't load as expected(!). 

The final challenge was changing the MongoDB database calls to prevent simultaneous user updates from causing data to be lost. This required both front and back-end changes, as the previous code would update an album and push the updated album to the database. The new code is now written to either add or remove the data in question from an attribute of an *Album*, rather than updating the whole *Album.* In practice, this means two users can favorite an album at the same time, or add tags at the same time, without one person's changes "saving over" the others. 

The results of this iteration were some of the most exciting to date. The front end of the application feels smoother from a user perspective, and behind the scenes all the most data-heavy pages are making *significantly* fewer external calls. This results in a more consistent experience across home and mobile networks, and could even be seen in the New Relic Synthetics charts which had much fewer peaks and valleys when loading the same page a different times through out the day. Finally, the more reliable data and application models provide a great platform to continue to build on with confidence for iterations to come.

## Iteration Six:
For the sixth iteration of the site the software version number was incremented again due to the scale of this update. After reviewing how users were most commonly interacting with the site, it became apparent that while connections and tags are decently useful to most users, the favorites list is far-and-away the most popular feature of the app. I reached out to some users and discovered that what they really enjoyed about the favorites feature was the combination of ease-of-use alongside the visual style of a compact collection of favorite albums. 

In this iteration I rolled out a *lists* functionality in Album Tags for the first time. In a way, *favorites* works kind of like a list, but due to the way it was implemented as an attribute of an *album*, it was not very extensible or flexible. The *lists* functionality operates separately from *favorites* and allows users to create their own lists, add and remove albums, rename lists, decide what display name they want to show *(by: Josh Jones, for example)* and share lists with others, even those who have never signed in to the site. 

To take advantage of tags added to *albums*, I used the `virtual` and `populate` Mongoose API’s to link albums to a list when they exist in the database. This is basically as close as you can get to a left-join in MongoDB. One neat trick about this approach is an album doesn’t have to be in the albums database to show up in a list. It also means if an album is added later with tags, all lists that contain that album will start to have access to those tags for filtering or other functionality down the line.

After the back-end for this feature was completed, I added the functionality in to the existing *update* page but quickly realized this fourth big feature was the final tipping point for the *albumdetails* page. Thus far, I had continued to add new cards for each new feature, but the page was just getting too full to be fun to use on mobile. I used the opportunity this presented to create a new *album* page that combines the functionality of the previous *update* and *albumdetails* pages while adding all the new lists functionality. The new UI uses a single card with multiple tabs to help display information at a higher density. An added benefit of this layered UI is that slower API calls for images etc. have less affect on what users see when they first load an albums *album* page, making for a smoother user experience. 

I used my staging environment to continually deploy the different elements of this feature while it was being written in order to find and address as many bugs and usability improvements as possible. Some notable items that were improved with this approach are front and back end data validation which now includes length limits for user input, success messages to indicate when a tag or new list is added, and added functionality to provide a smooth user experience when logging in and out on the page. I was also able to modify the back-end to read things that should really be obfuscated *(like API keys)* from environment variables instead of having them hard-coded into the repo, an important security improvement as the data collections continue to grow. 

## Outcome
Click [here](https://www.albumtags.com/) to view with the current production release of Album Tags. I use it every day to keep track of my music library and I'm really proud of how it turned out. Along the way I learned so much more than I ever thought I would and I have thoroughly enjoyed the opportunity to work and collaborate with many creative users and new friends. I plan to continue to maintain and improve this app as issues arise and as more features are needed. Feel free to reach out to me with any feedback or questions you have, I'm accessible on [LinkedIn](https://www.linkedin.com/in/jhunschejones) or by [email](mailto:joshua@hunschejones.com).