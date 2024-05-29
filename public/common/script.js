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

  $.post('chatbot-answer',
      { msg: $('#msg-txt').val() },
      function(data, status){
        if(status === 'success'){
          $('#message-area').append("<tr><td><span>"+data.original+"</span></td></tr>");
          $('#message-area').append("<tr><td><span>"+data.response+"</span></td></tr>");
          $('#msg-txt').val('');
        }//if
      });//fn+post

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
