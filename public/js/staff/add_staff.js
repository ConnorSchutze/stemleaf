//Get the objects we need to modify
let add_staff_form = document.getElementById('add_staff_form');

// Modify the objects we need
add_staff_form.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let input_staff_name = document.getElementById("input_staff_user_add");
    let input_start_date = document.getElementById("input_staff_start_date_add");
    let input_chg_hour = document.getElementById("input_staff_chg_hour_add");

    // Get the values from the form fields
    let staff_user_id_value = input_staff_name.value;
    let staff_name_value = input_staff_name.options[input_staff_name.selectedIndex].text;
    let start_date_value = input_start_date.value;
    let chg_hour_value = input_chg_hour.value;

    // Put our data we want to send in a javascript object
    let data = {
        user_id: staff_user_id_value,
        staff_name: staff_name_value,
        start_date: start_date_value,
        chg_hour: chg_hour_value
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/staff/add/", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            let new_staff = JSON.parse(xhttp.response)[0];
            // Add the new data to the table
            add_row_to_staff(new_staff);

            // Clear the input fields for another transaction
            input_staff_name.value = '';
            input_start_date.value = '';
            input_chg_hour.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})


// Creates a single row from an Object representing a single record from
// Staff
add_row_to_staff = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let staff_table = document.getElementById("staff_table_body");

    // Create a new row and add data cells to it
    let row = document.createElement("tr");
    let id_cell = document.createElement("td");
    let name_cell = document.createElement("td");
    let date_cell = document.createElement("td");
    let chg_cell = document.createElement("td");
    let delete_cell = document.createElement("td");

    // Add the data to the cells
    id_cell.innerText = data.id;
    name_cell.innerText = data.staff_name;
    date_cell.innerText = data.start_date;
    chg_cell.innerText = data.chg_hour;

    id_cell.setAttribute('class', 'data');
    name_cell.setAttribute('class', 'data');
    date_cell.setAttribute('class', 'data');
    chg_cell.setAttribute('class', 'data');
    
    let delete_button = document.createElement("button");
    delete_button.innerText = "Delete";
    delete_button.onclick = () => {
        delete_staff_id(data.id, data.staff_name);
    }
    delete_cell.appendChild(delete_button);

    // Add the cells to the row
    row.appendChild(id_cell);
    row.appendChild(name_cell);
    row.appendChild(date_cell);
    row.appendChild(chg_cell);
    row.appendChild(delete_cell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', data.id);

    // Add the row to the table
    staff_table.appendChild(row);


    //Remove the staff from the Add Staff dropdown
    let select = document.getElementById("input_staff_user_add");
    let options = select.options;
    for (let i = 0; i < options.length; i++) {
        if (options[i].text == data.staff_name) {
            select.remove(i);
            break;
        }
    }


    //Add the staff to the Update Staff dropdown
    select = document.getElementById("input_staff_user_update");
    
    let option = document.createElement("option");
    option.value = data.id;
    option.text = data.staff_name;
    select.add(option);

}