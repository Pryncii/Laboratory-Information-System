$(document).ready(function(){
  $("#msg-btn").click(function(){
    $.post('chatbot-answer',
      { msg: $('#msg-txt').val() },
      function(data, status){
        if(status === 'success'){
          $('#message-area').append("<tr><td><span>"+data.original+"</span></td></tr>");
          $('#message-area').append("<tr><td><span>"+data.response+"</span></td></tr>");
          $('#msg-txt').val('');
        }//if
      });//fn+post
  });//btn

  function getSomeValueFromUrl() {
    var pathArray = window.location.pathname.split('/');
    return pathArray[pathArray.length - 1]; // Get the last segment of the URL path
}

  $("#backButton").click(function(){
      var backValue = getSomeValueFromUrl() - 1;
      if (backValue) {
          $.post('/main/' + backValue, // Replace with your actual data endpoint
          {},
          function(data, status){
              if(status === 'success'){
                  var $tableBody = $('#data-table tbody');
                  $tableBody.empty(); // Clear any existing rows
  
                  // Iterate over the data and append rows to the table
                  $.each(data, function(index, item){
                      var row = `<tr data-patient-id="${item.patientID}" data-patient-name="${item.patientName}" data-status="${item.status}" data-remarks="${item.remarks}" data-date-start="${item.dateStart}" data-date-end="${item.dateEnd}">
                          <th class="item-container number"><h5>${index + 1}</h5></th>
                          <td class="item-container"><h5>${item.patientID}</h5></td>
                          <td class="item-container"><h5>${item.patientName}</h5></td>
                          <td class="item-container"><h5>${item.category}</h5></td>
                          <td class="item-container status"><a data-bs-toggle="modal" data-bs-target="#statusModal" role="button">
                          <h5 class="status-item ${item.barColor}">${item.status}</h5></a></td>
                          <td class="item-container"><h5>${item.remarks}</h5></td>
                          <td class="item-container date"><h5>${item.dateStart}</h5></td>
                          <td class="item-container date"><h5>${item.dateEnd}</h5></td>
                      </tr>`;
                      $tableBody.append(row);
                  });
              } else {
                  console.error('Failed to fetch data');
              }
          });
      } else {
          console.error('someValue not found in URL');
      }
  });

  $("#nextButton").click(function(){
    var nextValue = getSomeValueFromUrl() + 1;
    if (nextValue) {
        $.post('/main/' + nextValue, // Replace with your actual data endpoint
        {},
        function(data, status){
            if(status === 'success'){
                var $tableBody = $('#data-table tbody');
                $tableBody.empty(); // Clear any existing rows

                // Iterate over the data and append rows to the table
                $.each(data, function(index, item){
                    var row = `<tr data-patient-id="${item.patientID}" data-patient-name="${item.patientName}" data-status="${item.status}" data-remarks="${item.remarks}" data-date-start="${item.dateStart}" data-date-end="${item.dateEnd}">
                        <th class="item-container number"><h5>${index + 1}</h5></th>
                        <td class="item-container"><h5>${item.patientID}</h5></td>
                        <td class="item-container"><h5>${item.patientName}</h5></td>
                        <td class="item-container"><h5>${item.category}</h5></td>
                        <td class="item-container status"><a data-bs-toggle="modal" data-bs-target="#statusModal" role="button">
                        <h5 class="status-item ${item.barColor}">${item.status}</h5></a></td>
                        <td class="item-container"><h5>${item.remarks}</h5></td>
                        <td class="item-container date"><h5>${item.dateStart}</h5></td>
                        <td class="item-container date"><h5>${item.dateEnd}</h5></td>
                    </tr>`;
                    $tableBody.append(row);
                });
            } else {
                console.error('Failed to fetch data');
            }
        });
    } else {
        console.error('someValue not found in URL');
    }
});

$('.Hematology, .ClinicalMicroscopy, .Chemistry, .Serology').change(function() {
    if ($('.Hematology:checked').length) {
      $('.ClinicalMicroscopy, .Chemistry, .Serology').prop('disabled', true);
    } else if ($('.ClinicalMicroscopy:checked').length) {
      $('.Hematology, .Chemistry, .Serology').prop('disabled', true);
    } else if ($('.Chemistry:checked').length) {
      $('.Hematology, .ClinicalMicroscopy, .Serology').prop('disabled', true);
    } else if ($('.Serology:checked').length) {
      $('.ClinicalMicroscopy, .Chemistry, .Hematology').prop('disabled', true);
    } else {
      $('.Hematology, .ClinicalMicroscopy, .Chemistry, .Serology').prop('disabled', false);
    }
  });
  
  $("#selectPatient").change(function() {
      var selectedName = $("#selectPatient").val();
      let nameParts = selectedName.split(',');
      let lastName = nameParts[0].trim();
      if (lastName.includes(' ')) {
        let lastNameParts = lastName.split(' ');
        lastName = lastNameParts.join('');
      }
      let firstName = nameParts[1].trim().split(' ');
      firstName.pop();
      if (firstName.length > 1) {
        firstName = firstName.join('');
      }
      $("[id$='-phoneno']").hide();
      $("[id$='-email']").hide();
      $("[id$='-sex']").hide();
      $("[id$='-age']").hide();
      $('#' + firstName + '-' + lastName + '-phoneno').show();
      $('#' + firstName + '-' + lastName + '-email').show();
      $('#' + firstName + '-' + lastName + '-sex').show();
      $('#' + firstName + '-' + lastName + '-age').show();
  });
  
    })

function confirmPatientRequest(){
  var patientName = document.getElementById('selectPatient').value;
  var category = ''
  if (($('#searchbtn').is(':visible'))) {
    alert('Please select a patient!');
  } else  if ($('.Hematology:checked, .ClinicalMicroscopy:checked, .Chemistry:checked, .Serology:checked').length < 1) {
    alert('Please select at least one (1) test!');
  } else {
    document.getElementById('confirmModalLabel').innerText = 'Confirming Patient Request';
    document.getElementById('confirmModalBody').innerText = '';
    if ($('.Hematology:checked').length) {
      category = 'Hematology';
    } else if ($('.ClinicalMicroscopy:checked').length) {
      category = 'ClinicalMicroscopy';
    } else if ($('.Chemistry:checked').length) {
      category = 'Chemistry';
    } else if ($('.Serology:checked').length) {
      category = 'Serology';
    }
    document.getElementById('confirmName').innerHTML = patientName;
    document.getElementById('confirmMedtech').innerHTML = '(Name of Medtech)';
    document.getElementById('confirmCategory').innerHTML = category;
    $('#confirmModal').modal({
      backdrop: 'static', 
      keyboard: false
    });
    $('#confirmModal').modal('show');
  }
}

function resetRequest() {
  document.getElementById('confirmModalBody').innerHTML = '';
  $('#confirmModal').modal('hide');
}

function addRequest() {
  let patientID, medtechID, category;
  var selectedName = $("#selectPatient").val();
  let nameParts = selectedName.split(',');
  let lastName = nameParts[0].trim();
  if (lastName.includes(' ')) {
    let lastNameParts = lastName.split(' ');
    lastName = lastNameParts.join('');
  }
  let firstName = nameParts[1].trim().split(' ');
  firstName.pop();
  if (firstName.length > 1) {
    firstName = firstName.join('');
  }
  patientID = $('#' + firstName + '-' + lastName + '-patientid').attr('placeholder');
  medtechID = 1000; //temp
  category = $('#confirmCategory').text();
  window.location.href = `/add-patientrequest?patientID=${patientID}&medtechID=${medtechID}&category=${category}`;
}

function searchPatient() {
  if ($('#searchbtn').is(':visible')){
    var list = document.getElementById('patientList');
    var patientList = new Array();
    for(var i = 0; i < list.options.length; i++) {
      patientList.push(list.options[i].value);
    }
    var searchName = $('#patientname').val().trim().toLowerCase();
    var filteredNames = patientList.filter(function(name) {
        return name.toLowerCase().includes(searchName);
    });
    if(filteredNames.length > 0) {
      $('#selectPatient').empty();
      filteredNames.forEach(function(name) {
        $('#selectPatient').append($('<option>', {
              value: name,
              text: name
          }));
      });
      $('#selectPatient').show();
      $('#patientname').hide();
      $('#cancelbtn').show();
      $('#searchbtn').hide();

      var selectedName = filteredNames[0];
      let nameParts = selectedName.split(',');
      let lastName = nameParts[0].trim();
      if (lastName.includes(' ')) {
        let lastNameParts = lastName.split(' ');
        lastName = lastNameParts.join('');
      }
      let firstName = nameParts[1].trim().split(' ');
      firstName.pop();
      if (firstName.length > 1) {
        firstName = firstName.join('');
      }
      $('#phoneno').hide();
      $('#email').hide();
      $('#sex').hide();
      $('#age').hide();
      $('#' + firstName + '-' + lastName + '-phoneno').show();
      $('#' + firstName + '-' + lastName + '-email').show();
      $('#' + firstName + '-' + lastName + '-sex').show();
      $('#' + firstName + '-' + lastName + '-age').show();
    }
  } else {
    $('#selectPatient').hide();
    $('#patientname').show();
    $('#cancelbtn').hide();
    $('#searchbtn').show();
    $("[id$='-phoneno']").hide();
    $("[id$='-email']").hide();
    $("[id$='-sex']").hide();
    $("[id$='-age']").hide();
    $('#phoneno').show();
    $('#email').show();
    $('#sex').show();
    $('#age').show();
  }
}
