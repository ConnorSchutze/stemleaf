// Get the objects we need to modify
let add_instructors_form = document.getElementById('add_instructors_form');

// Modify the objects we need
add_instructors_form.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let input_staff_id = document.getElementById("input_instructors_staff_add");
    let input_course_id = document.getElementById("input_instructors_course_add");
    let input_staff_bio = document.getElementById("input_instructors_bio_add");

    // Get the values from the form fields
    let staff_id_value = input_staff_id.value;
    let course_id_value = input_course_id.value;
    let staff_bio_value = input_staff_bio.value;

    // Put our data we want to send in a javascript object
    let data = {
        staff_id: staff_id_value,
        course_id: course_id_value,
        staff_bio: staff_bio_value
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/instructors/add/", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            let new_instructor = JSON.parse(xhttp.response)[0];
            // Add the new data to the table
            add_row_to_instructors(new_instructor);

            // Clear the input fields for another transaction
            input_staff_id.value = '';
            input_course_id.value = '';
            input_staff_bio.value = '';
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
add_row_to_instructors = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let instructors_table = document.getElementById("instructors_table");

    // Create a row and 5 cells
    let row = document.createElement("TR");
    let id_cell = document.createElement("TD");
    let staff_cell = document.createElement("TD");
    let course_cell = document.createElement("TD");
    let bio_cell = document.createElement("TD");
    let delete_cell = document.createElement("TD");

    // Fill the cells with correct data
    id_cell.innerText = data.id;
    staff_cell.innerText = data.staff;
    course_cell.innerText = data.course;
    bio_cell.innerText = data.bio;

    let delete_button = document.createElement("button");
    delete_button.innerHTML = "Delete";
    delete_button.onclick = function(){
        delete_instructor_id(data.id);
    };
    delete_cell.appendChild(delete_button);

    // Add the cells to the row 
    row.appendChild(id_cell);
    row.appendChild(staff_cell);
    row.appendChild(course_cell);
    row.appendChild(bio_cell);
    row.appendChild(delete_cell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', data.id);
    
    // Add the row to the table
    instructors_table.appendChild(row);
}