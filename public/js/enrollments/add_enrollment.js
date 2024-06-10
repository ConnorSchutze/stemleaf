// Citation for the following code:
// Date: 05/27/2024
// Adapted from
// Source URL: add_instructor.js
// Description: Front end changes from database queries

// Get the objects we need to modify
let add_enrollments_form = document.getElementById('add_enrollments_form');

// Modify the objects we need
add_enrollments_form.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let input_status = document.getElementById("input_enrollments_status_add");
    let input_grade = document.getElementById("input_enrollments_grade_add");
    let input_user = document.getElementById("input_enrollments_user_add");
    let input_course = document.getElementById("input_enrollments_course_add");

    // Get the values from the form fields
    let status_value = input_status.checked ? 1 : 0;
    let grade_value = input_grade.value;
    let user_value = input_user.value;
    let course_value = input_course.value;

    // Put our data we want to send in a javascript object
    let data = {
        status: status_value,
        grade: grade_value,
        user_id: user_value,
        course_id: course_value
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/enrollments/add/", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            let new_enrollment = JSON.parse(xhttp.response)[0];
            // Add the new data to the table
            add_row_to_enrollments(new_enrollment);

            // Clear the input fields for another transaction
            input_status.value = '';
            input_grade.value = '';
            input_user.value = '';
            input_course.value = '';
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
add_row_to_enrollments = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let enrollments_table = document.getElementById("enrollments_table");

    // Create a row and 5 cells
    let row = document.createElement("TR");
    let id_cell = document.createElement("TD");
    let status_cell = document.createElement("TD");
    let grade_cell = document.createElement("TD");
    let user_cell = document.createElement("TD");
    let course_cell = document.createElement("TD");
    let delete_cell = document.createElement("TD");

    // Fill the cells with correct data
    id_cell.innerText = data.id;
    status_cell.innerText = data.status;
    grade_cell.innerText = data.grade;
    user_cell.innerText = data.user;
    course_cell.innerText = data.course;

    let delete_button = document.createElement("button");
    delete_button.innerHTML = "Delete";
    delete_button.onclick = function(){
        delete_enrollment_id(data.id);
    };
    delete_cell.appendChild(delete_button);

    // Add the cells to the row 
    row.appendChild(id_cell);
    row.appendChild(status_cell);
    row.appendChild(grade_cell);
    row.appendChild(user_cell);
    row.appendChild(course_cell);
    row.appendChild(delete_cell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', data.id);
    
    // Add the row to the table
    enrollments_table.appendChild(row);
}