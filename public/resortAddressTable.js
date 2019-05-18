function getTable (){
    let req = new XMLHttpRequest();
    req.open('GET','http://flip3.engr.oregonstate.edu:9879/resortAddress/table', true);
    req.addEventListener('load',function(){
        if(req.status >= 200 && req.status < 400){
            let response = JSON.parse(req.responseText);
            console.log(response);
            makeTable(response.response);
        } else {
            console.log("Error in network request: " + req.statusText);
        }});
    req.send(null);
}

//pair of functions to make resort names drop down
/*
function reguestResortNames(location){
    let req = new XMLHttpRequest();
    req.open('GET','http://flip3.engr.oregonstate.edu:9879/resort/getAllResortName', true);
    req.addEventListener('load',function(){
        if(req.status >= 200 && req.status < 400){
            let response = JSON.parse(req.responseText);
            console.log(response);
            let element = document.getElementById(location);//need to change for location
            makeResortMenu(response.response, element);
        } else {
            console.log("Error in network request: " + req.statusText);
        }});
    req.send(null);
}


function makeResortMenu(responseText, element){

    let resortName = document.createElement("form");
    resortName.id = "ResortNames";
    let selectHolder = document.createElement("select");

    for(let para in responseText){
        let holder = document.createElement("option");
        holder.textContent = responseText[para].name;
        holder.id= responseText[para].name;
        holder.value = responseText[para].id;
        selectHolder.appendChild(holder);
    }

    resortName.appendChild(selectHolder);
    element.appendChild(resortName);
}
reguestResortNames("dropDownResortHolder"); */

getTable();
bindButtons();


function makeTable (responseText){

    let element = document.getElementById("outTable");
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }

    let headerAdd = document.createElement("thead");
    let names = ['Street', 'City', 'State','Zip'];
    for (let data= 0; data<4; data++){
        let headData = document.createElement('th');
        headData.textContent = names[data];
        headerAdd.appendChild(headData);
    }
    element.appendChild(headerAdd);

    for(let para in responseText){
        //make a row element first
        let rowAdd = document.createElement("tr");
        rowAdd.id=responseText[para].id;

        let tableRowName = document.createElement("td");
        tableRowName.textContent = responseText[para].street;
        rowAdd.appendChild(tableRowName);

        let tableRowReps = document.createElement("td");
        tableRowReps.textContent = responseText[para].city;
        rowAdd.appendChild(tableRowReps);

        let tableRowWeight = document.createElement("td");
        tableRowWeight.textContent = responseText[para].state;
        rowAdd.appendChild(tableRowWeight);

        let tableRowDate = document.createElement("td");
        tableRowDate.textContent = responseText[para].zip;
        rowAdd.appendChild(tableRowDate);


        let buttonDelete = document.createElement('button');
        buttonDelete.value = responseText[para].id;
        buttonDelete.textContent = 'Delete';
        buttonDelete.addEventListener('click', function (event) {
            let req = new XMLHttpRequest();
            let payload = {id: null};
            payload.id = buttonDelete.value;
            req.open('POST', 'http://flip3.engr.oregonstate.edu:9879/resortAddress/simple-delete', true);
            req.setRequestHeader('Content-Type', 'application/json');
            req.addEventListener('load',function(){
                if(req.status >= 200 && req.status < 400){
                    let response = JSON.parse(req.responseText);
                    if(response.response.affectedRows > 0){
                        let table = document.getElementById('outTable');
                        let elementRemove=document.getElementById(buttonDelete.value);
                        table.removeChild(elementRemove);
                    }
                } else {
                    console.log("Error in network request: " + req.statusText);
                }});
            req.send(JSON.stringify(payload));
            event.preventDefault();
        });

        rowAdd.appendChild(buttonDelete);



        let buttonUpdate = document.createElement('button');
        buttonUpdate.value = responseText[para].id;
        buttonUpdate.textContent = 'Update';
        buttonUpdate.addEventListener('click', function (event) {
            let req = new XMLHttpRequest();
            let payload = {id: null};
            payload.id = buttonUpdate.value;
            req.open('GET', 'http://flip3.engr.oregonstate.edu:9879/resortAddress/getvalue?id='+payload.id, true);
            req.addEventListener('load',function(){
                if(req.status >= 200 && req.status < 400){
                    let response = JSON.parse(req.responseText);
                    let valuesHolder = response.response;
                    let holder = document.getElementById("updateHold");
                    let updatNew = document.createElement("form");
                    updatNew.method = "post";
                    let input1 = document.createElement("input");
                    input1.value = valuesHolder[0].street;
                    input1.type = "text";
                    input1.id = "streetUpdate";
                    updatNew.appendChild(input1);
                    let input2 = document.createElement("input");
                    input2.value = valuesHolder[0].city;
                    input2.type = "text";
                    input2.id = "cityUpdate";
                    updatNew.appendChild(input2);
                    let input3 = document.createElement("input");
                    input3.value = valuesHolder[0].state;
                    input3.type = "text";
                    input3.id = "stateUpdate";
                    updatNew.appendChild(input3);
                    let input4 = document.createElement("input");
                    input4.type = "number";
                    input4.value= valuesHolder[0].zip;
                    input4.id = "zipUpdate";
                    updatNew.appendChild(input4);

                    let input6 = document.createElement("input");
                    input6.type = "submit";
                    input6.id = "updateSubmit";
                    input6.addEventListener("click", function (event) {
                        let req = new XMLHttpRequest();
                        let payload = {street: null, city: null, state: null, zip: null, id: null};
                        payload.street = document.getElementById('streetUpdate').value;
                        payload.city = document.getElementById('cityUpdate').value;
                        payload.state = document.getElementById('stateUpdate').value;
                        payload.zip = document.getElementById('zipUpdate').value;
                        payload.id = valuesHolder[0].id;
                        req.open('POST', 'http://flip3.engr.oregonstate.edu:9879/resortAddress/simple-update', true);
                        req.setRequestHeader('Content-Type', 'application/json');
                        req.addEventListener('load',function(){
                            if(req.status >= 200 && req.status < 400){
                                let getRid = document.getElementById("updateHold");
                                while(getRid.firstChild){
                                    getRid.removeChild(getRid.firstChild);
                                }
                                getTable();
                            } else {
                                console.log("Error in network request: " + req.statusText);
                            }});
                        req.send(JSON.stringify(payload));
                        event.preventDefault();

                    });
                    updatNew.appendChild(input6);
                    holder.appendChild(updatNew);
                } else {
                    console.log("Error in network request: " + req.statusText);
                }});
            req.send(null);
            event.preventDefault();
        });

        rowAdd.appendChild(buttonUpdate);

        //add the newly made row to the tbody element made earlier
        element.appendChild(rowAdd);
    }

}


function bindButtons() {
    document.getElementById('addItem').addEventListener('click', function (event) {
        let req = new XMLHttpRequest();
        let payload = {street: null, city: null, state: null, zip: null};
        payload.street = document.getElementById('street').value;
        payload.city = document.getElementById('city').value;
        payload.state = document.getElementById('state').value;
        payload.zip  = document.getElementById('zip').value;
        req.open('POST', 'http://flip3.engr.oregonstate.edu:9879/resortAddress/insert', true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener('load',function(){
            if(req.status >= 200 && req.status < 400){
                let response = JSON.parse(req.responseText);
                if (response.response.insertId != 0){
                    getTable();
                }
            } else {
                console.log("Error in network request: " + req.statusText);
            }});
        req.send(JSON.stringify(payload));

        event.preventDefault();
    })

    document.getElementById('searchItem').addEventListener('click', function (event) {
        let req = new XMLHttpRequest();
        let payload = {street: null, city: null, state: null, zip: null};
        payload.street = document.getElementById('street').value;
        payload.city = document.getElementById('city').value;
        payload.state = document.getElementById('state').value;
        payload.zip  = document.getElementById('zip').value;
        req.open('POST', 'http://flip3.engr.oregonstate.edu:9879/resortAddress/search', true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener('load',function(){
            if(req.status >= 200 && req.status < 400){
                let response = JSON.parse(req.responseText);
                    makeTable(response.response);

            } else {
                console.log("Error in network request: " + req.statusText);
            }});
        req.send(JSON.stringify(payload));

        event.preventDefault();
    })

}
