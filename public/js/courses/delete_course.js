// Citation for the following code:
// Date: 05/27/2024
// Adapted from
// Source URL: delete_instructor.js
// Description: Front end changes from database queries

function delete_course_id(id) {
    console.log("delete_enrollment: start");
    // Put our data we want to send in a javascript object
    let data = {
        id: id
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", `/courses/delete/${id}`, true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            delete_course_row(id);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}


function delete_course_row(id){
    let table = document.getElementById("courses_table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == id) {
            table.deleteRow(i);
            break;
       }
    }
}