
// Get the objects we need to modify
let update_user_form = document.getElementById('update_user_form');

// Modify the objects we need
update_user_form.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let input_email = document.getElementById("input_users_email_update");
    let input_first_name = document.getElementById("input_users_first_name_update")
    let input_last_name = document.getElementById("input_users_last_name_update");

    // Get the values from the form fields
    let email_value = input_email.value;
    let first_name_value = input_first_name.value;
    let last_name_value = input_last_name.value;

    // Put our data we want to send in a javascript object
    let data = {
        email: email_value,
        first_name: first_name_value,
        last_name: last_name_value,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", `/users/update`, true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            update_user_row(xhttp.response);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function update_user_row(data){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("users_table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        let user_id_key = row.getAttribute("data-value");

        if (user_id_key == parsedData[0].id) {
            let td_f = row.getElementsByTagName("td")[1]
            let td_l = row.getElementsByTagName("td")[2];
            td_f.innerHTML = parsedData[0].first;
            td_l.innerHTML = parsedData[0].last;
            break;
        }
    }
}
