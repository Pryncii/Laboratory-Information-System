$(document).ready(function() {
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

    $('#wPayment').click(function() {
        payStatus = "Paid";
        addRequest(payStatus);
    });

    $('#woPayment').click(function() {
        payStatus = "Unpaid";
        addRequest(payStatus);
    });
  });
  
  function confirmPatientRequest() {
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
  
  function addRequest(payStatus) {
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

      window.location.href = `/add-patient-request?patientID=${patientID}&medtechID=${medtechID}&category=${category}&test=${test}&payStatus=${payStatus}`;
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