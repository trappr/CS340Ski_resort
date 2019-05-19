function getTable (){
    let req = new XMLHttpRequest();
    req.open('GET','http://flip3.engr.oregonstate.edu:8585/lift/table', true);
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
    req.open('GET','http://flip3.engr.oregonstate.edu:8585/resort/getAllResortName', true);
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
    let names = ['Name', 'Chairs', 'Top'];
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
        tableRowName.textContent = responseText[para].name;
        rowAdd.appendChild(tableRowName);

        let tableRowReps = document.createElement("td");
        tableRowReps.textContent = responseText[para].chairs;
        rowAdd.appendChild(tableRowReps);

        let tableRowWeight = document.createElement("td");
        tableRowWeight.textContent = responseText[para].top;
        rowAdd.appendChild(tableRowWeight);

        let tableRowDate = document.createElement("td");
        let payload = {id: null};
        payload.id = responseText[para].address_ID;
        let req = new XMLHttpRequest();
        req.open('GET', 'http://flip3.engr.oregonstate.edu:8585/liftResort/getvalue?id='+payload.id, true);
        req.addEventListener('load',function() {
            if (req.status >= 200 && req.status < 400) {
                let response = JSON.parse(req.responseText);
                tableRowDate.textContent = response.response[0].street;

            }else{
                console.log("Error in network request: " + req.statusText);
            }

        })
        req.send(null);
        rowAdd.appendChild(tableRowDate);

        let buttonDelete = document.createElement('button');
        buttonDelete.value = responseText[para].id;
        buttonDelete.textContent = 'Delete';
        buttonDelete.addEventListener('click', function (event) {
            let req = new XMLHttpRequest();
            let payload = {id: null};
            payload.id = buttonDelete.value;
            req.open('POST', 'http://flip3.engr.oregonstate.edu:8585/lift/simple-delete', true);
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
            req.open('GET', 'http://flip3.engr.oregonstate.edu:8585/lift/getvalue?id='+payload.id, true);
            req.addEventListener('load',function(){
                if(req.status >= 200 && req.status < 400){
                    let response = JSON.parse(req.responseText);
                    let valuesHolder = response.response;
                    let holder = document.getElementById("updateHold");
                    let updatNew = document.createElement("form");
                    updatNew.method = "post";
                    let input1 = document.createElement("input");
                    input1.value = valuesHolder[0].name;
                    input1.type = "text";
                    input1.id = "nameUpdate";
                    updatNew.appendChild(input1);
                    let input2 = document.createElement("input");
                    input2.value = valuesHolder[0].chairs;
                    input2.type = "number";
                    input2.id = "chairsUpdate";
                    updatNew.appendChild(input2);
                    let input3 = document.createElement("input");
                    input3.value = valuesHolder[0].top;
                    input3.type = "checkbox";
                    input3.id = "topUpdate";
                    updatNew.appendChild(input3);

                    let input6 = document.createElement("input");
                    input6.type = "submit";
                    input6.id = "updateSubmit";
                    input6.addEventListener("click", function (event) {
                        let req = new XMLHttpRequest();
                        let payload = {name: null, chairs: null, top: null, id: null};
                        payload.name = document.getElementById('nameUpdate').value;
                        payload.chairs = document.getElementById('chairsUpdate').value;
                        payload.top = document.getElementById('topUpdate').value;
                        payload.id = valuesHolder[0].id;
                        req.open('POST', 'http://flip3.engr.oregonstate.edu:8585/resortAddress/simple-update', true);
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
        let payload = {name: null, chairs: null, top: null};
        payload.name = document.getElementById('name').value;
        payload.chairs = document.getElementById('chairs').value;
        payload.top = document.getElementById('top').value;
        req.open('POST', 'http://flip3.engr.oregonstate.edu:8585/lift/insert', true);
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

    document.getElementById('updateLiftResort').addEventListener('click', function (event) {
        let req = new XMLHttpRequest();
        let payload = {lift: null, resort: null};
        payload.lift = document.getElementById('liftList').value;
        payload.resort = document.getElementById('resortList').value;
        req.open('POST', 'http://flip3.engr.oregonstate.edu:8585/lift/resortUpdate', true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener('load',function(){
            if(req.status >= 200 && req.status < 400){
                let response = JSON.parse(req.responseText);

                    getTable();
            } else {
                console.log("Error in network request: " + req.statusText);
            }});
        req.send(JSON.stringify(payload));

        event.preventDefault();
    });

}

//requires the element is in the form as a select
function makeMenu(responseText, element){
    for(let para in responseText){
        let holder = document.createElement("option");
        holder.textContent = responseText[para].street;
        holder.id= responseText[para].street;
        holder.value = responseText[para].id;
        element.appendChild(holder);
    }

}

function reguestLiftNames(location){
    let req = new XMLHttpRequest();
    req.open('GET','http://flip3.engr.oregonstate.edu:8585/lift/getAllLiftName', true);
    req.addEventListener('load',function(){
        if(req.status >= 200 && req.status < 400){
            let response = JSON.parse(req.responseText);
            console.log(response);
            let element = document.getElementById(location);//need to change for location
            makeLiftMenu(response.response, element);
        } else {
            console.log("Error in network request: " + req.statusText);
        }});
    req.send(null);
}

function makeLiftMenu(responseText, element){

    for(let para in responseText){
        let holder = document.createElement("option");
        holder.textContent = responseText[para].name;
        holder.id= responseText[para].name;
        holder.value = responseText[para].id;
        element.appendChild(holder);
    }

}
reguestLiftNames("liftList");