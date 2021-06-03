document.addEventListener('DOMContentLoaded', BuildTable);
document.addEventListener('DOMContentLoaded', AddWorkout);

function UpdateTable (obj) {
  for (var i = 0; i < obj.rows.length; i++) {
    if (obj.rows[i].lbs) {
      obj.rows[i].weightFmt =  obj.rows[i].weight + " lbs";
      //console.log('test 1! ' + obj.rows[i].weightFmt);
    } else {
      obj.rows[i].weightFmt =  obj.rows[i].weight + " kg";
      //console.log('test 2! ' + obj.rows[i].weightFmt);
    }
    
    var newRow = document.getElementById('workoutTbody').insertRow();
    newRow.setAttribute('id', 'row' + obj.rows[i].id);
    var newCell0 = newRow.insertCell();
    newCell0.setAttribute('id', 'cell' + obj.rows[i].id + '.name');
    newCell0.innerHTML = '<input type="text" class="inputRow' + obj.rows[i].id + ' name="input'  + obj.rows[i].id + '.name" ' +
      'id="input'  + obj.rows[i].id + '.name" value="' + obj.rows[i].name + '" disabled>';
    var newCell1 = newRow.insertCell();
    newCell1.setAttribute('id', 'cell' + obj.rows[i].id + '.reps');
    newCell1.innerHTML = '<input type="number" class="inputRow' + obj.rows[i].id + ' name="input'  + obj.rows[i].id + '.reps" ' +
      'id="input'  + obj.rows[i].id + '.reps" value="' + obj.rows[i].reps + '" disabled>';
    var newCell2 = newRow.insertCell();
    newCell2.setAttribute('id', 'cell' + obj.rows[i].id + '.weight');
    newCell2.innerHTML = '<input type="number" class="inputRow' + obj.rows[i].id + ' name="input'  + obj.rows[i].id + '.weight" ' +
      'id="input'  + obj.rows[i].id + '.weight" value="' + obj.rows[i].weight + '" disabled>';
    var newCell3 = newRow.insertCell();
    newCell3.setAttribute('id', 'cell' + obj.rows[i].id + '.lbs');
    newCell3.innerHTML = '<select class="inputRow' + obj.rows[i].id + ' name="input'  + obj.rows[i].id + '.lbs" ' +
      'id="input'  + obj.rows[i].id + '.lbs" disabled> <option value = "1">lbs</option> <option value="0">kg</option> ' + 
      '</select>';
    document.getElementById('input'  + obj.rows[i].id + '.lbs').value = obj.rows[i].lbs;
    var newCell4 = newRow.insertCell();
    newCell4.setAttribute('id', 'cell' + obj.rows[i].id + '.date');
    newCell4.innerHTML = '<input type="date" class="inputRow' + obj.rows[i].id + ' name="input'  + obj.rows[i].id + '.date" ' +
      'id="input'  + obj.rows[i].id + '.date" value="' + obj.rows[i].date.substring(0,10) + '" disabled>';
    var newCell5 = newRow.insertCell();
    newCell5.setAttribute('id', 'cell' + obj.rows[i].id + '.btns');
    newCell5.innerHTML = '<input type="button" class="editBtn" value="Edit" id="editRow' + obj.rows[i].id + '"> ' +
      '<input type="button" class="updateBtn" value="Update" id="updateRow' + obj.rows[i].id + '" hidden> ' +
      '<input type="button" class="cancelBtn" value="Cancel" id="cancelRow' + obj.rows[i].id + '" hidden> ' +
      '<input type="button" class="deleteBtn" value="Delete" id="deleteRow' + obj.rows[i].id + '">'; 
  }
  EditWorkout();
  CancelEdit();
  UpdateWorkout();
  DeleteWorkout();
  document.getElementById("addForm").reset();
}

function AddWorkout () {
  document.getElementById('addWorkout').addEventListener('click', function(event) {
    var reqObject = {};
    reqObject.name = document.getElementById('name').value;
    reqObject.reps = document.getElementById('reps').value;
    reqObject.weight = document.getElementById('weight').value;
    reqObject.lbsFlag = document.getElementById('lbsFlag').value;
    reqObject.date = document.getElementById('date').value;
    //alert(JSON.stringify(reqObject));
    var req = new XMLHttpRequest();
    req.open('POST', './addworkout', true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', function() {
      if(req.status >= 200 && req.status < 400){ 
        var obj = JSON.parse(req.responseText);
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
  var elements = document.getElementsByClassName('editBtn');
  //alert('EditWorkout() ' + elements.length);
  for (var i = 0; i < elements.length; i++) {
    //alert(elements[i].id);
    elements[i].addEventListener('click', function(event) {
      var idNum = (/\d+/).exec(this.id).toString();
      //alert(idNum);
      document.getElementById('editRow' + idNum).setAttribute('hidden', true);
      document.getElementById('updateRow' + idNum).removeAttribute('hidden');
      document.getElementById('cancelRow' + idNum).removeAttribute('hidden');
      document.getElementById('deleteRow' + idNum).setAttribute('hidden', true);
      var inputs = document.getElementsByClassName('inputRow' + idNum);
      for (var j = 0; j < inputs.length; j++) {
        inputs[j].removeAttribute('disabled');
      }
    })
  }
}

function CancelEdit () {
  var elements = document.getElementsByClassName('cancelBtn');
  //alert('CancelEdit() ' + elements.length);
  for (var i = 0; i < elements.length; i++) {
    //alert(elements[i].id);
    elements[i].addEventListener('click', function(event) {
      document.getElementById('tableDiv').innerHTML = '';
      BuildTable();
    })
  }
}

function UpdateWorkout () {
  var elements = document.getElementsByClassName('updateBtn');
  //alert('UpdateWorkout() ' + elements.length);
  for (var i = 0; i < elements.length; i++) {
    //alert(elements[i].id);
    elements[i].addEventListener('click', function(event) {
      var idNum = (/\d+/).exec(this.id).toString();
      //alert(idNum);
      document.getElementById('editRow' + idNum).removeAttribute('hidden');
      document.getElementById('updateRow' + idNum).setAttribute('hidden', true);
      document.getElementById('cancelRow' + idNum).setAttribute('hidden', true);
      document.getElementById('deleteRow' + idNum).removeAttribute('hidden');
      
      var inputs = document.getElementsByClassName('inputRow' + idNum);
      var reqObject = {};
      reqObject.id = idNum;
      reqObject.name = document.getElementById(inputs[0].id).value;
      reqObject.reps = document.getElementById(inputs[1].id).value;
      reqObject.weight = document.getElementById(inputs[2].id).value;
      reqObject.lbsFlag = document.getElementById(inputs[3].id).value;
      reqObject.date = document.getElementById(inputs[4].id).value;
      var req = new XMLHttpRequest();
      req.open('POST', './updateworkout', true);
      req.setRequestHeader('Content-Type', 'application/json');
      req.addEventListener('load', function() {
        if(req.status >= 200 && req.status < 400){ 
          var obj = JSON.parse(req.responseText);
        } else {
          console.log('Error in network request: ' + req.statusText);
        }
      });
      req.send(JSON.stringify(reqObject));
      event.preventDefault();
      document.getElementById('tableDiv').innerHTML = '';
      BuildTable();
    });
  }
}

function DeleteWorkout () {
  var elements = document.getElementsByClassName('deleteBtn');
  //alert('DeleteWorkout() ' + elements.length);
  for (var i = 0; i < elements.length; i++) {
    //alert(elements[i].id);
    elements[i].addEventListener('click', function(event) {
      var idNum = (/\d+/).exec(this.id).toString();
      //alert(idNum);
      var reqObject = {};
      reqObject.id = idNum;
      var req = new XMLHttpRequest();
      req.open('POST', './deleteworkout', true);
      req.setRequestHeader('Content-Type', 'application/json');
      req.addEventListener('load', function() {
        if(req.status >= 200 && req.status < 400){ 
          var obj = JSON.parse(req.responseText);
        } else {
          console.log('Error in network request: ' + req.statusText);
        }
      });
      req.send(JSON.stringify(reqObject));
      event.preventDefault();
      document.getElementById('tableDiv').innerHTML = '';
      BuildTable();
    });
  }
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
  req.open('GET', './workouts', true);
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