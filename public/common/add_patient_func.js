function checkAgeToBday() {
    let bday = $("#bday").val() ? new Date($("#bday").val()) : false; // assign false if no value
    let age = parseInt($("#age").val());

    const bdayField = document.getElementById("bday");
    if(age && bday) {
        let now = new Date();
        let checkAge = now.getFullYear() - bday.getFullYear();

        const bdayMonth = bday.getMonth();
        const nowMonth = now.getMonth();
        const bdayDay = bday.getDate();
        const nowDay = now.getDate();

        if(nowMonth < bdayMonth || (nowMonth === bdayMonth && nowDay < bdayDay)) {
            checkAge--;
        }

        if(age == checkAge) {
            bdayField.setCustomValidity("");
            bdayField.reportValidity();
            return true;
        }
        else {
            bdayField.setCustomValidity("Age and Birthdate do not match");
            bdayField.reportValidity();
            return false;
        }
    }
    else {
        bdayField.setCustomValidity("");
        bdayField.reportValidity();
        return true;
    }
}

function confirmPatientReg() {
    if (checkAgeToBday()) {
        let lname = $('#lname').val().trim()[0].toUpperCase() + $('#lname').val().trim().slice(1);
        let fname = $('#fname').val().trim()[0].toUpperCase() + $('#fname').val().trim().slice(1);
        let minit = $('#mname').val().trim()[0].toUpperCase();
        let patient_name = lname + ", " + fname + " " + minit + ".";
        let sex = $('#sex').val();
        let age = parseInt($("#age").val());

        let isDuplicate = null;

        $.ajax({
            type: "POST",
            url: "/addpatient-duplicate",
            data: 
            {
                patient_name: patient_name,
                sex: sex,
                age: age
            },
            async: false,
            success: function(data, status) {
                if (status === 'success') {
                    isDuplicate = data.dup;
                }
            }
        });
        if(isDuplicate){
            alert("Patient Information Already Exists in Database")
            return !isDuplicate;  // Return true if not duplicate, false otherwise
        }
        else
            return confirm('Proceed to Patient Request?');
    } else {
        return false; // Return false if age check fails
    }
}

$(document).ready(function(){
    $('#bday').on('change', checkAgeToBday);
    $('#age').on('change', checkAgeToBday);
});//doc

  
