// Get the objects we need to modify
let addInstructorForm = document.getElementById('add-instructor-form-ajax');

// Modify the objects we need
addInstructorForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let input_staff_id = document.getElementById("input-staff_id");
    let input_course_id = document.getElementById("input-course_id");
    let input_staff_bio = document.getElementById("input-staff_bio");

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
    xhttp.open("POST", "/add-instructor-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

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
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("instructors-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let instructor_id_cell = document.createElement("TD");
    let staff_id_cell = document.createElement("TD");
    let course_id_cell = document.createElement("TD");
    let staff_bio_cell = document.createElement("TD");

    let delete_cell = document.createElement("TD");

    // Fill the cells with correct data
    instructor_id_cell.innerText = newRow.instructor_id;
    staff_id_cell.innerText = newRow.staff_id;
    course_id_cell.innerText = newRow.course_id;
    staff_bio_cell.innerText = newRow.staff_bio;

    delete_cell = document.createElement("button");
    delete_cell.innerHTML = "Delete";
    delete_cell.onclick = function(){
        delete_instructor(newRow.instructor_id);
    };

    // Add the cells to the row 
    row.appendChild(instructor_id_cell);
    row.appendChild(staff_id_cell);
    row.appendChild(course_id_cell);
    row.appendChild(staff_bio_cell);
    row.appendChild(delete_cell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.instructor_id);
    
    // Add the row to the table
    currentTable.appendChild(row);

    // Start of new Step 8 code for adding new data to the dropdown menu for updating people
    
    // Find drop down menu, create a new option, fill data in the option (full name, id),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let staff_menu = document.getElementById("input-staff_id-update");
    let staff_option = document.createElement("option");
    staff_option.text = newRow.staff_id; // Assuming newRow has staff_id as text. Adjust if needed.
    staff_option.value = newRow.staff_id;
    staff_menu.add(staff_option);

    let course_menu = document.getElementById("input-course_id-update");
    let course_option = document.createElement("option");
    course_option.text = newRow.course_id; // Assuming newRow has course_id as text. Adjust if needed.
    course_option.value = newRow.course_id;
    course_menu.add(course_option);
    // End of new step 8 code.
}