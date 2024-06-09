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
  
  $('#H-1').change(function() {
    if ($(this).is(':checked')) {
      $('#H-2').prop('disabled', false);
    } else {
      $('#H-2').prop('disabled', true).prop('checked', false);
    }
  });

  $(".clickable-row").click(function(){
    var targetModal = $(this).data("bs-target");
    $(targetModal).modal('show');
  });
})

function confirmPatientRequest(){
  var patientName = document.getElementById('selectPatient').value;
  var tests = [];

  if (($('#searchbtn').is(':visible'))) {
    alert('Please select a patient!');
  } else  if ($('.Hematology:checked, .ClinicalMicroscopy:checked, .Chemistry:checked, .Serology:checked').length < 1) {
    alert('Please select at least one (1) test!');
  } else {
    document.getElementById('confirmModalLabel').innerText = 'Confirming Patient Request';
    document.getElementById('confirmModalBody').innerText = '';

    // HEMATOLOGY
    if ($('#H-1:checked').length && $('#H-2:checked').length) {
      tests.push('CBC with Platelet Count');
    } else if ($('#H-1:checked').length) { tests.push('CBC'); }
    if ($('#H-3:checked').length) { tests.push('ESR'); }
    if ($('#H-4:checked').length) { tests.push('Blood Type with Rh'); }
    if ($('#H-5:checked').length) { tests.push('Clotting Time'); }
    if ($('#H-6:checked').length) { tests.push('Bleeding Time'); }
    
    // CLINICAL MICROSCOPY
    if ($('#CM-1:checked').length) { tests.push('Urinalysis'); }
    if ($('#CM-2:checked').length) { tests.push('Fecalysis'); }
    if ($('#CM-3:checked').length) { tests.push('FOBT'); }

    // CHEMISTRY
    if ($('#C-1:checked').length) { tests.push('FBS'); }
    if ($('#C-2:checked').length) { tests.push('Creatinine'); }
    if ($('#C-3:checked').length) { tests.push('Uric Acid'); }
    if ($('#C-4:checked').length) { tests.push('Cholesterol'); }
    if ($('#C-5:checked').length) { tests.push('Triglycerides'); }
    if ($('#C-6:checked').length) { tests.push('HDL'); }
    if ($('#C-7:checked').length) { tests.push('LDL'); }
    if ($('#C-8:checked').length) { tests.push('VLDL'); }
    if ($('#C-9:checked').length) { tests.push('BUN'); }
    if ($('#C-10:checked').length) { tests.push('SGPT'); }
    if ($('#C-11:checked').length) { tests.push('SGOT'); }
    if ($('#C-12:checked').length) { tests.push('HbA1c'); }
    
    // SEROLOGY
    if ($('#S-1:checked').length) { tests.push('HbsAg'); }
    if ($('#S-2:checked').length) { tests.push('RPR/VDRL'); }
    if ($('#S-3:checked').length) { tests.push('Serum Pregnancy Test'); }
    if ($('#S-4:checked').length) { tests.push('Urine Pregnancy Test'); }
    if ($('#S-5:checked').length) { tests.push('Dengue NS1'); }
    if ($('#S-6:checked').length) { tests.push('Dengue Duo'); }

    let test = tests.join(', ');

    document.getElementById('confirmName').innerHTML = patientName;
    document.getElementById('confirmTest').innerHTML = test;

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
  let patientID, medtechID;

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
  medtechID = 1000; // temp

  let categories = [];
  let categoryTests = {};
  
  if ($('.Hematology:checked').length) { categories.push('Hematology'); }
  if ($('.ClinicalMicroscopy:checked').length) { categories.push('Clinical Microscopy'); }
  if ($('.Chemistry:checked').length) { categories.push('Chemistry'); }
  if ($('.Serology:checked').length) { categories.push('Serology'); }

  categories.forEach(function(category) {
    categoryTests[category] = [];
  });

  categories.forEach(function(category) {
    if (category == "Hematology") {
        if ($('#H-1:checked').length && $('#H-2:checked').length) {
          categoryTests[category].push('CBC with Platelet Count');
        } else if ($('#H-1:checked').length) { categoryTests[category].push('CBC'); }
        if ($('#H-3:checked').length) { categoryTests[category].push('ESR'); }
        if ($('#H-4:checked').length) { categoryTests[category].push('Blood Type with Rh'); }
        if ($('#H-5:checked').length) { categoryTests[category].push('Clotting Time'); }
        if ($('#H-6:checked').length) { categoryTests[category].push('Bleeding Time'); }
    }

    if (category == "Clinical Microscopy") {
      if ($('#CM-1:checked').length) { categoryTests[category].push('Urinalysis'); }
      if ($('#CM-2:checked').length) { categoryTests[category].push('Fecalysis'); }
      if ($('#CM-3:checked').length) { categoryTests[category].push('FOBT'); }
    }

    if (category == "Chemistry") {
      if ($('#C-1:checked').length) { categoryTests[category].push('FBS'); }
      if ($('#C-2:checked').length) { categoryTests[category].push('Creatinine'); }
      if ($('#C-3:checked').length) { categoryTests[category].push('Uric Acid'); }
      if ($('#C-4:checked').length) { categoryTests[category].push('Cholesterol'); }
      if ($('#C-5:checked').length) { categoryTests[category].push('Triglycerides'); }
      if ($('#C-6:checked').length) { categoryTests[category].push('HDL'); }
      if ($('#C-7:checked').length) { categoryTests[category].push('LDL'); }
      if ($('#C-8:checked').length) { categoryTests[category].push('VLDL'); }
      if ($('#C-9:checked').length) { categoryTests[category].push('BUN'); }
      if ($('#C-10:checked').length) { categoryTests[category].push('SGPT'); }
      if ($('#C-11:checked').length) { categoryTests[category].push('SGOT'); }
      if ($('#C-12:checked').length) { categoryTests[category].push('HbA1c'); }
    }

    if (category == "Serology") {
      if ($('#S-1:checked').length) { categoryTests[category].push('HbsAg'); }
      if ($('#S-2:checked').length) { categoryTests[category].push('RPR/VDRL'); }
      if ($('#S-3:checked').length) { categoryTests[category].push('Serum Pregnancy Test'); }
      if ($('#S-4:checked').length) { categoryTests[category].push('Urine Pregnancy Test'); }
      if ($('#S-5:checked').length) { categoryTests[category].push('Dengue NS1'); }
      if ($('#S-6:checked').length) { categoryTests[category].push('Dengue Duo'); }
    }
    
    let test = categoryTests[category].join(', ');
    window.location.href = `/add-patientrequest?patientID=${patientID}&medtechID=${medtechID}&category=${category}&test=${test}`;
  });
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