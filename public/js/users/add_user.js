// Get the objects we need to modify
let add_users_form = document.getElementById('add_users_form');

// Modify the objects we need
add_users_form.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let input_first_name = document.getElementById("input_users_first_name_add");
    let input_last_name = document.getElementById("input_users_last_name_add");
    let input_email = document.getElementById("input_users_email_add");
    let input_password = document.getElementById("input_passwords_password_add");

    // Get the values from the form fields
    let first_name_value = input_first_name.value;
    let last_name_value = input_last_name.value;
    let email_value = input_email.value;
    let password_value = input_password.value;

    // Put our data we want to send in a javascript object
    let data = {
        first_name: first_name_value,
        last_name: last_name_value,
        email: email_value,
        password: password_value
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/users/add/", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            let new_user = JSON.parse(xhttp.response)[0];
            // Add the new data to the table
            add_row_to_users(new_user);

            // Clear the input fields for another transaction
            input_first_name.value = '';
            input_last_name.value = '';
            input_email.value = '';
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
add_row_to_users = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let users_table = document.getElementById("users_table");

    // Create a row and 5 cells
    let row = document.createElement("TR");
    let id_cell = document.createElement("TD");
    let first_name_cell = document.createElement("TD");
    let last_name_cell = document.createElement("TD");
    let email_cell = document.createElement("TD");

    // Fill the cells with correct data
    id_cell.innerText = data.id;
    first_name_cell.innerText = data.first;
    last_name_cell.innerText = data.last;
    email_cell.innerText = data.email;

    // Add the cells to the row 
    row.appendChild(id_cell);
    row.appendChild(first_name_cell);
    row.appendChild(last_name_cell);
    row.appendChild(email_cell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', data.id);
    
    // Add the row to the table
    users_table.appendChild(row);
}