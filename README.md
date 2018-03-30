# Music Tag Cloud

## Objective
Create a web app with a user-friendly interface that allows the user to access music data from the Apple Music API and add their own tags. The user should be able to search by album or artist, view album details, search by the tags associated with one album, or view all tags and search by any combination of tags.

## Steps Taken
The first challenge in building this app was the actual process of accessing the Apple Music API. I read the full documentation handbook on JWT's along with the full documentation on Apple's music api to figure out how to create the token I would need and how to include it in my api calls. The JSON that comes back from Apple takes a little bit of work to dig into, so I used Postman to view the results of a call and figure out how to access to the properties of the object that I needed.
  
I started with a static page that displays five albums selected by the moderator. This helped me decide what information I wanted to display and how to use string manipulation to clean it up for display. From there I created the album details page, which displays additional data and a card for the tags associated with each album. A fun challenge during this step was writing my own function to display a cleanly written out date for the album release instead of the yyyy-mm-dd format returned in the JSON object coming from Apple.
  
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    function makeNiceDate(uglyDate) {
        let year = uglyDate.slice(0, 4);
        let day = uglyDate.slice(8, 10);
        let uglyMonth = uglyDate.slice(5, 7); 
        let niceMonth = months[uglyMonth-1];
        return(`${niceMonth} ${day}, ${year}`);
    };
  
With the display page up, I created a search page that returned five albums and artists using the Apple Music Search API. I also created the "update" page, linking up a MongoDB database that stores the album ID and user tags in a collection of documents. The update page has to use a PUT request to add new tags since each tag is not its own document, and a POST request if the album ID is not already in the tag database.
  
Once the update and album details functionality was working, I created the search by tags functionality that allows the user to sellect tags in the album details page and search for other albums that have that combination of tags. I am really proud of the way the page allows a user to toggle tags, changing their display and adding/removing them from a 'selected tags' array in preparation for their search.

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
  
I also updated my call to Apple's search API so that it returns 25 albums and artists, with logic in my script file to first show the top 5 and offer an option for the user to expand the list if desired. I included a button to show the top five albums for each artist from within the artist list, and added some try-catch error handling to keep the script running if there are less than five results for any category.
  
The final major functionality I added was the "all-tags" page, which displays every tag in the MongoDB database and allows the user to select and search by any single or combination of tags. At this stage I noticed that the lack of standardization for capitalizing of tags was likely to cause some trouble as the database grew. I added some string manipulation to the update page to help address this.

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
  
These functions make changes to user input to standardize the appearance of tags, and address the situation where a tag is entered using a '/' character. This character is not allowed in a URI parameter for a search, so I created logic to store this tag with an '_' character in the database, but transform it back to a '/' character when displaying it in a tag.
  
Note: Throughout the construction of the site, I have done my best to test its appearance and performance both on desktop and mobile. Because of the simple user interface requirements, I decided to stick with the same layout for both, adjusting breakpoints and CSS to make sure it is easy to read on a common range of screen sizes.
  
The final hurdle to overcome was a bug that created a long TTFB time when requesting data from Apple's api's. I reviewed my code with a senior developer and cleaned up some syntax and formatting. I was not able to identify what the actual cause was, but this cleanup appears to have helped my site performance significantly so it is safe to assume there was some delay caused by the smelly code in my routing and api calls.

## Outcome
Click [here](https://music-this-week.herokuapp.com/) to play with the current live version of the app. I'm hosting it on Heroku for the added experience of deploying and maintaining a live application and I'm really proud of how this turned out. I built this app for myself and my friends as we are major music fans and often like to recommend albums based on other albums one of us likes. I plan to continue to maintain and improve this app as issues arise and as I learn more about Node.js and ReSTful applications. Feel free to reach out to me with any feedback or questions you have, I'm available on [LinkedIn](https://www.linkedin.com/in/jhunschejones), [Twitter](https://twitter.com/jhunschejones), or by [email](mailto:contact@joshuahunschejones.com).
