// Citation for the following code:
// Date: 05/27/2024
// Adapted from
// Source URL: update_instructor.js
// Description: Front end changes from database queries

//Get the object we need to modify
let update_staff_form = document.getElementById('update_staff_form');

// Modify the object we need
update_staff_form.addEventListener("submit", function (e) {

    //prevent the form from submitting
    e.preventDefault();

    // Get the form fields we need to get data from
    let input_staff_name = document.getElementById("input_staff_user_update");
    let input_start_date = document.getElementById("input_staff_start_date_update");
    let input_chg_hour = document.getElementById("input_staff_chg_hour_update");
    let input_null = document.getElementById("input_staff_nullable_update");

    let staff_user_id_value = input_staff_name.value;
    let staff_name_value = input_staff_name.options[input_staff_name.selectedIndex].text;
    let start_date_value = input_start_date.value;
    let chg_hour_value = input_chg_hour.value;
    let null_value = input_null.checked ? 1 : 0;

    // Put our data we want to send in a javascript object
    let data = {
        staff_id: staff_user_id_value,
        staff_name: staff_name_value,
        start_date: start_date_value,
        chg_hour: chg_hour_value,
        null_opt: null_value
    }

    console.log(data);

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", `/staff/update`, true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            update_staff_row(xhttp.response, staff_user_id_value);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
});


function update_staff_row(data, staff_user_id) {
    console.log(data);
    let parsedData = JSON.parse(data);

    let table = document.getElementById("staff_table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        let staff_id_key = row.getAttribute("data-value");

        if (staff_id_key == parsedData[0].id) {
            row.cells[0].innerText = staff_user_id;
            row.cells[1].innerText = parsedData[0].staff_name;
            row.cells[2].innerText = parsedData[0].start_date;
            row.cells[3].innerText = parsedData[0].chg_hour;
            break;
        }
    }
}