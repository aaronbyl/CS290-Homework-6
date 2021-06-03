document.addEventListener('DOMContentLoaded', AddWorkout);
document.addEventListener('DOMContentLoaded', EditWorkout);
document.addEventListener('DOMContentLoaded', BuildTable);

function UpdateTable (obj) {
  for (var i = 0; i < obj.rows.length; i++) {
    if (obj.rows[i].lbs) {
      obj.rows[i].weightFmt =  obj.rows[i].weight + " lbs";
      //console.log('test 1! ' + obj.rows[i].weightFmt);
    } else {
      obj.rows[i].weightFmt =  obj.rows[i].weight + " kg";
      //console.log('test 2! ' + obj.rows[i].weightFmt);
    }
    //if no errors add row to table with new row data
    
    
    
    var newRow = document.getElementById('workoutTbody').insertRow();
    newRow.setAttribute('id', 'row' + obj.rows[i].id);
    var newCell0 = newRow.insertCell();
    newCell0.setAttribute('id', 'cell' + obj.rows[i].id + '.name');
    newCell0.innerHTML = obj.rows[i].name;
    var newCell1 = newRow.insertCell();
    newCell1.setAttribute('id', 'cell' + obj.rows[i].id + '.reps');
    newCell1.innerHTML = obj.rows[i].reps;
    var newCell2 = newRow.insertCell();
    newCell2.setAttribute('id', 'cell' + obj.rows[i].id + '.weight');
    newCell2.innerHTML = obj.rows[i].weightFmt;
    var newCell3 = newRow.insertCell();
    newCell3.setAttribute('id', 'cell' + obj.rows[i].id + '.lbs');
    newCell3.innerHTML = obj.rows[i].lbs;
    var newCell4 = newRow.insertCell();
    newCell4.setAttribute('id', 'cell' + obj.rows[i].id + '.date');
    newCell4.innerHTML = obj.rows[i].date;
    var newCell5 = newRow.insertCell();
    newCell5.setAttribute('id', 'cell' + obj.rows[i].id + '.btns');
    newCell5.innerHTML = "<input type='button' value='Edit' id='editRow" + obj.rows[i].id + "'> " +
      "<input type='button' value='Update' id='updateRow" + obj.rows[i].id + "' hidden> " +
      "<input type='button' value='Cancel' id='cancelRow" + obj.rows[i].id + "' hidden> " +
      "<input type='button' value='Delete' id='deleteRow" + obj.rows[i].id + "'>"; 
  }
}

function AddWorkout () {
  document.getElementById('addWorkout').addEventListener('click', function(event) {
    var req = new XMLHttpRequest();
    var reqObject = {};
    reqObject.name = document.getElementById('name').value;
    reqObject.reps = document.getElementById('reps').value;
    reqObject.weight = document.getElementById('weight').value;
    reqObject.lbsFlag = document.getElementById('lbsFlag').value;
    reqObject.date = document.getElementById('date').value;
    //alert(JSON.stringify(reqObject));
    req.open('POST', 'http://localhost:5635/addworkout', true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', function() {
      if(req.status >= 200 && req.status < 400){ 
        var obj = JSON.parse(req.responseText);
        document.getElementById('addWorkoutResult').textContent = 'addWorkoutResult API Response: ' + JSON.stringify(obj.results);
        //Format weight
        UpdateTable(obj);
      } else {
        console.log('Error in network request: ' + req.statusText);
      }
    });
    req.send(JSON.stringify(reqObject));
    event.preventDefault();
  })
}

function EditWorkout () {
  //document.getElementById('
}

function BuildTable () {
  if (!document.getElementById("workoutTable")) {
    //alert('exists = false');
    var header = ['Name', 'Reps', 'Weight', 'lbs/kg', 'Date', ''];
    //create thead
    var newThead = document.createElement('thead');
    var newRow = document.createElement('tr');
    for (var i = 0; i < header.length; i++) {
      var newCol = document.createElement('th');
      newCol.textContent = header[i];
      newRow.appendChild(newCol);
    }
    newThead.appendChild(newRow);
    
    //create tbody
    var newTbody = document.createElement('tbody');
    newTbody.id = 'workoutTbody';
    //Create table
    var newTable = document.createElement('table');
    newTable.id = 'workoutTable';
    newTable.appendChild(newThead);    
    newTable.appendChild(newTbody);
    document.getElementById('tableDiv').appendChild(newTable);
  }
  
  //send get request for current database table
  var req = new XMLHttpRequest();
  req.open('GET', 'http://localhost:5635/workouts', true);
  req.addEventListener('load', function() {
    if(req.status >= 200 && req.status < 400){ 
      var obj = JSON.parse(req.responseText);
      UpdateTable(obj);
    } else {
      console.log('Error in network request: ' + req.statusText);
    }
  });
  req.send(null);
  event.preventDefault();
}