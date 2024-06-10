// Citation for the following code:
// Date: 05/24/2024
// Adapted from
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Description: Front end changes from database queries

// Get the objects we need to modify
let update_instructor_form = document.getElementById('update_instructor_form');

// Modify the objects we need
update_instructor_form.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let input_staff = document.getElementById("input_instructors_staff_update");
    let input_course = document.getElementById("input_instructors_course_update")
    let input_staff_bio = document.getElementById("input_instructors_bio_update");

    // Get the values from the form fields
    let staff_value = input_staff.value;
    let course_value = input_course.value;
    let staff_bio_value = input_staff_bio.value;

    // Put our data we want to send in a javascript object
    let data = {
        staff_id: staff_value,
        course_id: course_value,
        staff_bio: staff_bio_value,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", `/instructors/update`, true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            update_instructor_row(xhttp.response, staff_value, course_value);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function update_instructor_row(data, staff_id, course_id){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("instructors_table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        let instructor_id_key = row.getAttribute("data-value");

        if (instructor_id_key == parsedData[0].id) {
            let td = row.getElementsByTagName("td")[3];
            td.innerHTML = parsedData[0].bio;
            break;
        }
    }
}
