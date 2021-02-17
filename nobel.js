// global variables:
var prizesByYearJson = null;
var winnersByIDJson = null;
var maleIds = [];
var femaleIds = [];

// function loadJsonFile() gets called in HTML onload event
function loadJsonFile() {
    loadFile();
}


// funtion loadFile() is based on the function from Lecture 11 - Json by David Coyle - used to read both Json files
function loadFile() {
    var xmlhttp = new XMLHttpRequest();
    var url = "prizesByYear.json"
    
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            prizesByYear = JSON.parse(xmlhttp.responseText);
            
            // saved json as global variable to be used later
            prizesByYearJson = prizesByYear;
    
             // called same function populateSelectYear() with different parameters: one for "Year from" and the other "Year to":   
            populateSelectYear(prizesByYear, "selectYear");
            populateSelectYear(prizesByYear, "selectYearTo");
            
            // called another function to get category:
            populateCategory(prizesByYear, "selectCategory");
        }
    };
    
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    
    
    var winnersByIDRead = new XMLHttpRequest();
    var url2 = "winnersByID.json"
    
    winnersByIDRead.onreadystatechange = function() {
        if (winnersByIDRead.readyState == 4 && winnersByIDRead.status == 200) {
            winnersByIDJson = JSON.parse(winnersByIDRead.responseText);
            
            // on response save json into a data structure by gender
            get_gender(winnersByIDJson);
        }
    };
    
    winnersByIDRead.open("GET", url2, true);
    winnersByIDRead.send();  
    
    
}


// function to populate the dropdown menu with years
// used the website Code By Amir (https://www.codebyamir.com/blog/populate-a-select-dropdown-list-with-json) to populate the select dropdown list.
function populateSelectYear(obj, selectName) {
    var prizes = obj.prizes;
    var uniqueYears = new Set();
    for (i = 0; i < prizes.length; i++) {
        uniqueYears.add(prizes[i].year); // used set to get unique results so categories wouldn't repeat.
    }
    
    var selectYear = document.getElementById(selectName);
    
    uniqueYears = Array.from(uniqueYears) // turned Set into Array so it can add elements to it.
    
    for (i = 0; i < uniqueYears.length; i++) {        
        var option = document.createElement('option');
        option.text = uniqueYears[i];
        selectYear.add(option, 0);   
    } 
    
}

// function to populate the dropdown menu with categories
function populateCategory(prizesbyYear, selectCateg) {
    var prizes = prizesbyYear.prizes;
    
    // used set to get unique results so categories wouldn't repeat.
    var uniqueCateogories = new Set();
    
    for (i = 0; i < prizes.length; i++) {
        uniqueCateogories.add("any")
        uniqueCateogories.add(prizes[i].category);
        
}
    
    var selecetCategory = document.getElementById(selectCateg);
    
    // turn Set into Array so it can add elements to it.
    uniqueCateogories = Array.from(uniqueCateogories); 
    
    for (i = 0; i < uniqueCateogories.length; i++) {    
        var option = document.createElement('option');
        option.text = uniqueCateogories[i];
        selecetCategory.add(option, 0);   
    } 
    
    
}

//function to add the female ids to var femaleIds and add the male ids to var maleIds 
// (both global variables at the top of this JS file)
function get_gender(obj){
    
    var laureates = obj.laureates;

    for (i = 0; i < laureates.length; i++) {
        if (laureates[i].gender == "female"){
            femaleIds.push(laureates[i].id);
        } else {
            maleIds.push(laureates[i].id);  
        }
    }
}

//function getGenderRadio() to check which option is selected on radio buttons and return it
//got information on  how to use radio buttons from w3schools tutorial
function getGenderRadio(){
    var gender = document.getElementsByName('gender');
    var gender_value;
    for(var i = 0; i < gender.length; i++){
        if(gender[i].checked){
            gender_value = gender[i].value;

        }
    }
    return gender_value;
}



// function onSubmit() will push all the information to a HTML table once the submit button is pressed (after selecting year range and category). It also compares the gender selected on the radio buttons to return only the ids of that gender.

// got idea and information on how to build the table using information from Json file from Pracical 6 from one of the Labs.

// got information on  how to use submit buttons from Pracical 6 from one of the Labs and w3schools tutorial.
function onSubmit(){
    
    var selectYearFrom = document.getElementById("selectYear");
    var yearFrom = Number(selectYear.options[selectYear.selectedIndex].text);
    
    var selectYearTo = document.getElementById("selectYearTo");
    var yearTo = Number(selectYearTo.options[selectYearTo.selectedIndex].text);
    
    var selectCategory = document.getElementById("selectCategory");
    var categorySelected = selectCategory.options[selectCategory.selectedIndex].text;    
    
    
    var table_out = '<h2>Winners</h2><table id="nobelwinners">';
    table_out += "<tr><th>Year</th><th>First Name</th><th>Surname</th><th>Motivation</th></tr>";    
    
    
    
    var radioSelection = getGenderRadio();
    for (var i=0; i <prizesByYearJson.prizes.length; i++) 
    {
        var prizeByYear = prizesByYearJson.prizes[i];
        var year = Number(prizesByYearJson.prizes[i].year);
        var category = prizesByYearJson.prizes[i].category;
        var overallMotivation = prizesByYearJson.prizes[i].overallMotivation;
        
        
        if (year >= yearFrom && year <= yearTo ){
            
            if (categorySelected == "any" || categorySelected == category){
            
                for (var j=0; j <prizeByYear.laureates.length; j++) {
                    

                    var id = prizeByYear.laureates[j].id;
                    
                    if (typeof radioSelection === "undefined" || 
                        radioSelection == "any" || 
                        (radioSelection == "female" && femaleIds.includes(id)) ||
                        (radioSelection == "male" && maleIds.includes(id))) {
                        
                        var firstname = prizeByYear.laureates[j].firstname;
                        var surname = prizeByYear.laureates[j].surname;
                        var motivation = prizeByYear.laureates[j].motivation;
                        var id = prizeByYear.laureates[j].id;

                        if (typeof motivation === "undefined") {
                            if (typeof overallMotivation === "undefined"){
                               motivation = ""; 

                            } else{
                                motivation = overallMotivation

                            }

                        }

                        table_out += "<tr><td>" +
                        year +
                        "</td><td>" +
                        firstname +
                        "</td><td>" +
                        surname +
                        "</td><td>" +
                        motivation +
                        "</td><td>" +
                        '<button type="button" id="learnMoreButton" onclick="showExtraInfo('+ id +')">Learn more</button>' +
                        "</td></tr>";
                          
                    }
                }
            }
        }
    }

    table_out += "</table>";    
    document.getElementById("tablePlaceholder").innerHTML = table_out;
    
}

// function called in HTML to select radio button
function onRadioClick(){
    onSubmit();
    
}


// function showExtraInfo(id) to push Personal Details of Nobel Winners into HTML:

// got idea and information on how to show the Personal Details of Nobel Winners
// using information from Json file from Pracical 6 from one of the Labs.

function showExtraInfo(id){
    for(var i = 0; i < winnersByIDJson.laureates.length; i++){
        var laureate = winnersByIDJson.laureates[i];
        if (laureate.id == id){
            
            var firstname = laureate.firstname;
            var surname = laureate.surname;
                if (surname === undefined){
                    surname = ""
                }
            var born = laureate.born;
                if (born == "0000-00-00"){
                    born = ""
                }
                    
            var died = laureate.died;
                if (died == "0000-00-00"){
                    died = ""
                }
            var bornCountry = laureate.bornCountry; 
                if (bornCountry === undefined){
                    bornCountry = ""
                }

            var bornCity = laureate.bornCity;
                if (bornCity === undefined){
                    bornCity = ""
                }
            var diedCountry = laureate.diedCountry;
                if (diedCountry === undefined){
                    diedCountry = ""
                }

            var diedCity = laureate.diedCity;
                if (diedCity === undefined){
                    diedCity = ""
                }
            var gender = laureate.gender;
                if (gender === undefined){
                    gender = ""
                }
            var prizes = laureate.prizes;
            
            for(var j = 0; j < prizes.length; j++){
                var yearPrize = prizes[j].year; 
                
                var category = prizes[j].category
                    if (category === undefined){
                    category = ""
                    }
                
                var motivation = prizes[j].motivation;
                    if (typeof motivation === "undefined") {
                        if (typeof overallMotivation === "undefined"){
                            motivation = ""; 
                        } else{
                            motivation = overallMotivation
                        }

                    }
                var affiliations = prizes[j].affiliations;
                
                for(var k = 0; k < prizes.length; k++){
                    var nameAffiliation = affiliations[k].name;
                        if (nameAffiliation === undefined){
                        nameAffiliation = ""
                        }
                    var cityAffiliation = affiliations[k].city;
                        if (cityAffiliation === undefined){
                        cityAffiliation = ""
                        }
                    var countryAffiliation = affiliations[k].country;
                      if (countryAffiliation === undefined){
                        countryAffiliation = ""
                        }  
                }
            }
            var personalDetails = "<h3>Personal details: </h3>"; 
            personalDetails += "First name: " + firstname + "<br>";
            personalDetails += "Surname: " + surname + "<br>";
            personalDetails += "Date of birth: " + born + "<br>";
            personalDetails += "Born in: " + bornCountry + "<br>";
            personalDetails += "Place of birth: " + bornCity + "<br>";
            personalDetails += "Date of death: " + died + "<br>";
            personalDetails += "Died in: " + diedCountry + "<br>";
            personalDetails += "Place of death: " + diedCity + "<br>";
            personalDetails += "Gender: " + gender + "<br>";
            personalDetails += "Awarded Nobel in: " + yearPrize + "<br>";
            personalDetails += "Category: " + category + "<br>";
            personalDetails += "Motivation: " + motivation + "<br>";
            personalDetails += "Affiliation: " + nameAffiliation + "<br>";
            personalDetails += "City: " + cityAffiliation + "<br>";
            personalDetails += "Country: " + countryAffiliation + "<br>";  
            
            break;
        }

    }
    document.getElementById("learnMore").innerHTML = personalDetails;
    
// got information on how to scroll down automatically to the bottom 
// of the page to show Personal information from "stack overflow" 
// (https://stackoverflow.com/questions/11715646/scroll-automatically-to-the-bottom-of-the-page):
    
    var scrollingElement = (document.scrollingElement || document.body);
    scrollingElement.scrollTop = scrollingElement.scrollHeight;
}

