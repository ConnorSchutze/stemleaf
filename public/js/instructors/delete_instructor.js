function delete_instructor_id(id) {
    console.log("delete_instructor: start");
    // Put our data we want to send in a javascript object
    let data = {
        id: id
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", `/instructors/delete/${id}`, true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            delete_instructor_row(id);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}


function delete_instructor_row(id){
    let table = document.getElementById("instructors_table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == id) {
            table.deleteRow(i);
            break;
       }
    }
}