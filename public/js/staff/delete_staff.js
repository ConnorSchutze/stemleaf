function delete_staff_id(id, name){

    let data = {
        id: id,
        name: name
    };

    console.log(data);

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", `/staff/delete/${id}`, true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            delete_staff_row(id, name);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    xhttp.send(JSON.stringify(data));

}

function delete_staff_row(id, name){
    let table = document.getElementById("staff_table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == id) {
            table.deleteRow(i);
            break;
        }
    }

    //add the deleted staff to the add options
    let select = document.getElementById("input_staff_user_add");

    let option = document.createElement("option");
    option.value = id;
    option.text = name;
    select.add(option);


    //remove the deleted staff from the update options
    select = document.getElementById("input_staff_user_update");

    options = select.options;
    for (let i = 0; i < options.length; i++) {
        if (options[i].value == id) {
            select.remove(i);
            break;
        }
    }
}