function setUpdateTableToValues(event){
    //Enable the update form if it is not enabled
    var updateRow = document.getElementsByClassName("updateRow")[0];
    updateRow.style.display = "block";

    //Get the data from the row that was clicked
    var rowToUpdate = event.target.parentElement.parentElement;
    var allCellsCollection = rowToUpdate.children;
    var allData = Array.from(allCellsCollection); //convert the HTMLCollection to an array

    //Get the header row
    var header = document.getElementById("headerRow");
    var headerCells = header.children;
    var headerData = Array.from(headerCells); //convert the HTMLCollection to an array

    var data = {};
    //Create a dictionary of the data from the row that was clicked
    for (var i = 2; i < headerData.length; i++){
        data[headerData[i].textContent.trim()] = allData[i].textContent.trim();
    }
    console.log(data);

    //Set the values of the update form to the data from the row that was clicked
    for(var key in data){
        var id = key + "Update";
        var element = document.getElementById(id);
        element = element.children[0];
        element.value = data[key];
        element.innerHTML = data[key];
    }
}


function setDeleteTableToValues(event){
    //Enable the delete form if it is not enabled
    var deleteRow = document.getElementsByClassName("deleteRow")[0];
    deleteRow.style.display = "block";

    //Get the data from the row that was clicked
    var rowToDelete = event.target.parentElement.parentElement;
    var allCellsCollection = rowToDelete.children;
    var allData = Array.from(allCellsCollection);

    //Get the header row
    var header = document.getElementById("headerRow");
    var headerCells = header.children;
    var headerData = Array.from(headerCells);

    var data = {};
    //Create a dictionary of the data from the row that was clicked
    for (var i = 2; i < headerData.length; i++){
        data[headerData[i].textContent.trim()] = allData[i].textContent.trim();
    }
    console.log(data);

    //Set the values of the delete form to the data from the row that was clicked
    for(var key in data){
        var id = key + "Delete";
        var element = document.getElementById(id);
        element = element.children[0];
        element.value = data[key];
        element.innerHTML = data[key];
    }
}