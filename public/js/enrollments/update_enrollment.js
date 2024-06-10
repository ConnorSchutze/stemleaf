
// Get the objects we need to modify
let update_enrollment_form = document.getElementById('update_enrollment_form');

// Modify the objects we need
update_enrollment_form.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let input_status = document.getElementById("input_enrollments_status_update");
    let input_grade = document.getElementById("input_enrollments_grade_update")
    let input_user = document.getElementById("input_enrollments_user_update");
    let input_course = document.getElementById("input_enrollments_course_update");

    // Get the values from the form fields
    let status_value = input_status.checked ? 1 : 0;
    let grade_value = input_grade.value;
    let user_value = input_user.value;
    let course_value = input_course.value;

    // Put our data we want to send in a javascript object
    let data = {
        status: status_value,
        grade: grade_value,
        user: user_value,
        course: course_value,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", `/enrollments/update`, true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            update_enrollment_row(xhttp.response);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function update_enrollment_row(data){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("enrollments_table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        let enrollment_id_key = row.getAttribute("data-value");

        if (enrollment_id_key == parsedData[0].id) {
            let td_s = row.getElementsByTagName("td")[1];
            let td_g = row.getElementsByTagName("td")[2];
            td_s.innerHTML = parsedData[0].status;
            td_g.innerHTML = parsedData[0].grade;
            break;
        }
    }
}
