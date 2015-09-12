/*
 * Author: Hayley van Waas, University of Canterbury
 * Date: September 2015
 *
 * This is an interactive designed to help students select which subjects to take in their first year of engineering at the University of Canterbury
 */


// TODO remove global variables
// TODO eng100 needs to be green for sem1 and sem2

var checked_eng_types = [];
var checked_subjects = [];


// Engineering type: required subjects
rules = {
    "All": ["ENG100", "ENGR101", "EMTH118", "EMTH119", "PHYS101"],
    "Software":  ["MATH120", "COSC121", "COSC122"],
    "Computer": ["EMTH171", "COSC121"],
    "Electrical and Electronic": ["EMTH171", "COSC121"],
    "Mechatronics": ["EMTH171", "COSC121", "ENGR102"],
    "Mechanical": ["EMTH171", "ENGR102"],
    "Civil": ["EMTH171", "CHEM111", "ENGR102"],
    "Natural Resources": ["EMTH171", "CHEM111", "ENGR102"],
    "Forest": ["EMTH171", "CHEM111", "ENGR102"],
    "Chemical and Process": ["EMTH171", "CHEM111"]
}

// Semester: available subjects
semester_occurances = {
    "Semester 1": ["ENG100", "ENGR101", "EMTH118", "PHYS101", "COSC121", "CHEM111"],
    "Semester 2": ["ENG100", "ENGR102", "EMTH119", "EMTH171", "COSC121", "CHEM111", "MATH120", "COSC122"],
    "Summer School": ["PHYS101", "COSC122"]  // check this
}


// on page load
$(document).ready(function() {

    var eng_types = Object.keys(rules); // get list of eng types from keys in dictionary
    // generate check box for each engineering type
    for (var i in eng_types) {
        generateEngCheckBoxes(eng_types[i], i);
    }

    // watch buttons for if clicked
    watchEngCB();

    updateTable(rules["All"]); // test

});


// create checkboxes for each eng type individually
function generateEngCheckBoxes(name, count) {

    // create the necessary elements
    var label = document.createElement("label");
    var description = document.createTextNode(name);
    var checkbox = document.createElement("input");

    checkbox.type = "checkbox";    // make the element a checkbox
    checkbox.name = 1;             // give it a name we can check in watchEngCB()
    checkbox.value = name;         // make its value
    checkbox.id = name;           // unique ID for each checkbox

    label.appendChild(checkbox);   // add the box to the element
    label.appendChild(description);// add the description to the element

    // add the label element to the div
    document.getElementById("eng_options").appendChild(label);

}


// watch the engineering checkboxes for change
function watchEngCB() {
    $("[name=1]").change(function() {
        // if "All" selected, automatically selects all engineering types
        if (this.value == "All") {
            var eng_types = Object.keys(rules); // get list of eng types from keys in dictionary
            if (this.checked == false) {
                // set each of the checkboxes to unchecked
                for (var i = 1; i < eng_types.length; i++ ) {
                    document.getElementById(eng_types[i]).checked = false;
                    document.getElementById(eng_types[i]).closest("label").className = "";
                }
                // clear checked eng types list
                checked_eng_types = [];
            } else {
                // set each of the checkboxes to checked
                for (var i = 1; i < eng_types.length; i++ ) {
                    document.getElementById(eng_types[i]).checked = true;
                    document.getElementById(eng_types[i]).closest("label").className = "selected-eng";
                }
                // reset list of checked eng types to inclue all
                checked_eng_types = eng_types;
            }
        } else {
            var index = checked_eng_types.indexOf(this.value);
            if (this.checked) { // if selected then add to list of checked eng types
                checked_eng_types.push(this.value);
                this.closest("label").className = "selected-eng";
            } else { // else if unselected then remove from list of checked eng types
                checked_eng_types.splice(index, 1);
                this.closest("label").className = "";
            }
        }
        // update list of required subjects
        updateReqSubjectList();
    });
}


// update list of required subjects depending on which checkboxes are clicked
function updateReqSubjectList() {

    var required_subjects = rules["All"].slice();  // gets a copy of subjects required for all courses

    for (var i in checked_eng_types) { // iterate through selected engineerying types
        subject_list = rules[checked_eng_types[i]]; // get subjects required for specific engineering type
        for (var j in subject_list) {
            // add subject to list of required subjects if it is not already there
            if (required_subjects.indexOf(subject_list[j]) == -1) {
                required_subjects.push(subject_list[j])
            }
        }
    }
    updateEngList(required_subjects);
    updateTable(required_subjects);
}


// rebuilds table based on eng selection
function updateTable(required_subjects) {

    // delete all rows of table below default
    var subject_table = document.getElementById("subject-table");
    $(".table-row").remove();

    // initialise counters to check number of subjects in each semester
    sem1_count = 0;
    sem2_count = 0;

    for (var i in required_subjects) {

        // create new row
        var table_row = document.createElement("div");
        table_row.className = "table-row";

        subject = required_subjects[i];
        selected = false; // boolean value to check if a button has already been placed

        if (semester_occurances["Semester 1"].indexOf(subject) != -1) {
            selected = true;
            sem1_count += 1;
            buildButton(table_row, subject, selected, sem1_count);
        } else {
            table_row.appendChild(buildLabel());
        }

        if (semester_occurances["Semester 2"].indexOf(subject) != -1) {
            if (selected == true && subject != "ENG100") {
                // change selected back to false so new button is not selected by default
                // unless subject is ENG100 (this must span accross both semesters)
                selected = false;
            } else {
                selected = true;
                sem2_count += 1;
            }
            buildButton(table_row, subject, selected, sem2_count);
        } else {
            table_row.appendChild(buildLabel());
        }

        if (semester_occurances["Summer School"].indexOf(subject) != -1) {
            if (selected == true) {
                selected = false; // change selected back to false so new button is not selected by default
            } else {
                selected = true;
            }
            buildButton(table_row, subject, selected, null);
        } else {
            table_row.appendChild(buildLabel());
        }

        table = document.getElementById("subject-table");
        table.appendChild(table_row);
    }
}


//build button element for table
function buildButton(table_row, subject, selected, count) {
    var button = document.createElement("input");
    button.type = "Submit";
    button.value = subject;
    button.id = subject;
    if (count > 5) {
        button.className = selected + " overflow subject-button";
    } else {
        button.className = selected + " subject-button";
    }
    table_row.appendChild(button);
    // check if subject is required for all engineering types
    if (rules["All"].indexOf(subject) != -1) {
        button.closest("div").className = "table-row default-row";
    }
}


// build label element for table
function buildLabel() {
    var label = document.createElement("label");
    label.innerHTML = "PLACE HOLDER";
    label.className = "place-holder";
    return label;
}


// determine which eng types are possible based on subjects currently in table
function updateEngList(subjects) {
    for (var i in rules) {
        if (i == "All") {
            continue;
        }
        req_subjects = rules[i];
        count = 0;
        for (j = 0; j < req_subjects.length; j++) {
            if (subjects.indexOf(req_subjects[j]) == -1) {
                break;
            } else {
                count ++;
            }
        }
        // change class for label (for colour coding)
        element = document.getElementById(i).closest("label");
        if (element.className == "selected-eng") {
            continue;
        } else if (req_subjects.length == count) {
            element.className = "possible-eng";
        } else {
            element.className = "";
        }
    }
}
