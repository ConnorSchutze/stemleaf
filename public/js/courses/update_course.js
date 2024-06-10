
// Get the objects we need to modify
let update_course_form = document.getElementById('update_course_form');

// Modify the objects we need
update_course_form.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let input_id = document.getElementById("input_courses_name_update");
    let input_subject = document.getElementById("input_courses_subject_update")
    let input_description = document.getElementById("input_courses_description_update");

    // Get the values from the form fields
    let id_value = input_id.value;
    let subject_value = input_subject.value;
    let description_value = input_description.value;

    // Put our data we want to send in a javascript object
    let data = {
        id: id_value,
        subject: subject_value,
        description: description_value,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", `/courses/update`, true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            update_course_row(xhttp.response);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function update_course_row(data){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("courses_table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        let course_id_key = row.getAttribute("data-value");

        if (course_id_key == parsedData[0].id) {
            let td_s = row.getElementsByTagName("td")[2];
            let td_d = row.getElementsByTagName("td")[3];
            td_s.innerHTML = parsedData[0].subject;
            td_d.innerHTML = parsedData[0].description;
            break;
        }
    }
}
