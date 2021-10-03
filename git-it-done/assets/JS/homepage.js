// connects to whole search box 
var userFormEl = document.querySelector("#user-form");
// connects to search input
var nameInputEl = document.querySelector("#username");
// connects to empty div for search results
var repoContainerEl = document.querySelector("#repos-container");
// connects to h2 <span> for showing repos
var repoSearchTerm = document.querySelector("#repo-search-term");

// searches for repos on click
var formSubmitHandler = function (event){
    event.preventDefault();
    
    // variable to connect to the value of the input
    var username = nameInputEl.value;

    // how web should act with input
    if (username){
        getUserRepos(username);
        userFormEl = "";
    } else {
        alert ("That is not a github repo")
    }
}



// gets information from the API
var getUserRepos = function(user){
    // format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos"

    // make a request to the url
    fetch(apiUrl).then(function(response){
        // if statment for 404 pages to see if response went through
        if (response.ok) {
        // format the data
        response.json().then(function(data) {
            // calls display function 
            displayRepos(data, user);
            // console log to see data
            console.log(data)
        });
      } else {
        alert("Error: GitHub User Not Found");
      }
    })

    .catch(function(error) {
        // Notice this `.catch()` getting chained onto the end of the `.then()` method
        alert("Unable to connect to GitHub");
    });


};

// displays our searched repos to the page
var displayRepos = function(repos, searchTerm) {

    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    console.log(repos);
    console.log(searchTerm);

    // loop over repos so they print out 
    for (var i = 0; i < repos.length; i++) {
        // format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;
    
        // create a container for each repo
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName)
    
        // create a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;
    
        // append to container
        repoEl.appendChild(titleEl);
    
        ////////////////////////////////////////

        // create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
        statusEl.innerHTML =
            "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
        statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        ///////////////////////////////////////

        // check if api returned any repos
        if (repos.length === 0) {
            repoContainerEl.textContent = "No repositories found.";
            return;
        }

        // append to container
        repoEl.appendChild(statusEl);

        // append container to the dom
        repoContainerEl.appendChild(repoEl);
    }

};
 
// search button listener
userFormEl.addEventListener("submit", formSubmitHandler)