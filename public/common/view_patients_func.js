$(document).ready(function(){
    $("#sortName-btn").click(function(){
      $.post(
        "sort-Patients",
        {
            name: $("#sortName-btn").text()
        },
        function(data, status){
            if(status === 'success'){
                $("#sortName-btn").text(data.nameBtn_text);
                let patientData = data.patientData;
                let table = document.getElementById("patientData");
                table.innerHTML = "";
                let patients = "";
                for(let i = 0; i < patientData.length; i++){
                    patient = patientData[i];
                    patients += `
                        <tr>
                            <td>${patient.name}</td> 
                            <td>${patient.latestDate}</td> 
                            <td>${patient.remarks}</td>
                        </tr>
                    `
                }
                table.innerHTML = patients;
            }//if
        });//fn+post
    });//btn

    $("#sortDate-btn").click(function(){
      $.post(
        "sort-Patients",
        {
            date: $("#sortDate-btn").text()
        },
        function(data, status){
            if(status === 'success'){
                $("#sortDate-btn").text(data.dateBtn_text);
                let patientData = data.patientData;
                let table = document.getElementById("patientData");
                table.innerHTML = "";
                let patients = "";
                for(let i = 0; i < patientData.length; i++){
                    patient = patientData[i];
                    patients += `
                        <tr>
                            <td>${patient.name}</td> 
                            <td>${patient.latestDate}</td> 
                            <td>${patient.remarks}</td>
                        </tr>
                    `
                }
                table.innerHTML = patients;
            }//if
        });//fn+post
    });//btn
});//doc

  