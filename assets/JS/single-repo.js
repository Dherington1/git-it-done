var limitWarningEl = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");



var getRepoIssues = function(repo) {
    console.log(repo);

    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";

    // call the fetch 
    fetch(apiUrl).then(function(response){
        // check if the response went through
        if (response.ok){
            // then convert function to make it into json date
            response.json().then(function(data){
                displayIssues(data);
                console.log(data);

            // check if api has paginated issues
            if (response.headers.get("Link")) {
                displayWarning();
            }

            })
        } else {
            // if not successful, redirect to homepage
            document.location.replace("./index.html");
        }
    })
};


var getRepoName = function(){
     // grab repo name from url query string
    var queryString = document.location.search;
    var repoName = queryString.split("=")[1];

    if(repoName){
        // display repo name on the page
        repoNameEl.textContent = repoName;

        getRepoIssues(repoName);
    } else {
        // if no repo was given, redirect to the homepage
        document.location.replace("./index.html");
    }
}
  
// displaces the issuse people have created in their repos
var displayIssues = function(issues) {
    // let ussers know if no issues open
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }

    // loop through the issues 
    for(i = 0; i < issues.length; i++){
        // create a link element to take users to the issue on github
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        // Issue objects have an html_url property, which links to the full issue on GitHub
        issueEl.setAttribute("href", issues[i].html_url);
        //added a target="_blank" attribute to each <a> element, to open the link in a new tab instead of replacing the current webpage.
        issueEl.setAttribute("target", "_blank");

        // create span to hold issue title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        // append to container
        issueEl.appendChild(titleEl);

        // create a type element
        var typeEl = document.createElement("span");

        // check if issue is an actual issue or a pull request
        if (issues[i].pull_request) {
        typeEl.textContent = "(Pull request)";
        } else {
        typeEl.textContent = "(Issue)";
        }

        // append to container
        issueEl.appendChild(typeEl);

        var issueContainerEl = document.querySelector("#issues-container");
        issueContainerEl.appendChild(issueEl);
        
    }
};

// displays that this site will only load 30 issues 
var displayWarning = function(repo) {
    // add text to warning container
    limitWarningEl.textContent = "To see more than 30 issues, visit ";

    var linkEl = document.createElement("a");
    linkEl.textContent = "See More Issues on GitHub.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");
  
    // append to warning container
    limitWarningEl.appendChild(linkEl);
};

getRepoName();