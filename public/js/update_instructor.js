
// Get the objects we need to modify
let update_instructor_form = document.getElementById('update-instructor-form-ajax');

// Modify the objects we need
update_instructor_form.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let input_staff_name = document.getElementById("input-staff_id-update");
    let input_course = document.getElementById("input-course_id-update")
    let input_staff_bio = document.getElementById("input-staff_bio-update");

    // Get the values from the form fields
    let staff_name_value = input_staff_name.value;
    let course_value = input_course.value;
    let staff_bio_value = input_staff_bio.value;

    // Put our data we want to send in a javascript object
    let data = {
        staff_id: staff_name_value,
        course_id: course_value,
        staff_bio: staff_bio_value,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-instructor-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, staff_name_value, course_value);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, staff_id, course_id){
    // let parsedData = JSON.parse(data);
    
    let table = document.getElementById("instructors-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        // if (table.rows[i].getAttribute("data-value") == personID) {
        if (row.cells[1].innerText == staff_id && row.cells[2].innerText == course_id) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign homeworld to our value we updated to
            // td.innerHTML = parsedData[0].name; 
            td.innerHTML = data[0].staff_bio; 
       }
    }
}
