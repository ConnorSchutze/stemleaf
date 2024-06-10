// Get the objects we need to modify
let add_courses_form = document.getElementById('add_courses_form');

// Modify the objects we need
add_courses_form.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let input_name = document.getElementById("input_courses_name_add");
    let input_subject = document.getElementById("input_courses_subject_add");
    let input_description = document.getElementById("input_courses_description_add");

    // Get the values from the form fields
    let name_value = input_name.value;
    let subject_value = input_subject.value;
    let description_value = input_description.value;

    // Put our data we want to send in a javascript object
    let data = {
        name: name_value,
        subject: subject_value,
        description: description_value
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/courses/add/", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            let new_course = JSON.parse(xhttp.response)[0];
            // Add the new data to the table
            add_row_to_courses(new_course);

            // Clear the input fields for another transaction
            input_name.value = '';
            input_subject.value = '';
            input_description.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// bsg_people
add_row_to_courses = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let courses_table = document.getElementById("courses_table");

    // Create a row and 5 cells
    let row = document.createElement("TR");
    let id_cell = document.createElement("TD");
    let name_cell = document.createElement("TD");
    let subject_cell = document.createElement("TD");
    let description_cell = document.createElement("TD");
    let delete_cell = document.createElement("TD");

    // Fill the cells with correct data
    id_cell.innerText = data.id;
    name_cell.innerText = data.name;
    subject_cell.innerText = data.subject;
    description_cell.innerText = data.description;

    let delete_button = document.createElement("button");
    delete_button.innerHTML = "Delete";
    delete_button.onclick = function(){
        delete_course_id(data.id);
    };
    delete_cell.appendChild(delete_button);

    // Add the cells to the row 
    row.appendChild(id_cell);
    row.appendChild(name_cell);
    row.appendChild(subject_cell);
    row.appendChild(description_cell);
    row.appendChild(delete_cell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', data.id);
    
    // Add the row to the table
    courses_table.appendChild(row);
}