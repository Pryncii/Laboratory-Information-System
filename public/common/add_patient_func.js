function checkAgeToBday() {
    let bday = $("#bday").val() ? new Date($("#bday").val()) : false; // assign false if no value
    let age = parseInt($("#age").val());

    if(age && bday) {
        $("#message").text(age + " " + bday);
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
            $(".agebday-notmatch").hide();
            $('#age').css("border", "none");
            $('#bday').css("border", "none");
            return true;
        }
        else {
            $(".agebday-notmatch").show();
            $('#age').css("border", "1px solid red");
            $('#bday').css("border", "1px solid red");
            return false;
        }
    }
    else {
        $(".agebday-notmatch").hide();
        $('#age').css("border", "none");
        $('#bday').css("border", "none");
        return true;
    }
}

function confirmPatientReg() {
    if(checkAgeToBday())
        return confirm('Proceed with registering a new patient?');
    else {
        alert('Invalid birthday and age.');
        return false;
    }
}

$(document).ready(function(){
    $('#bday').on('change', checkAgeToBday);
    $('#age').on('change', checkAgeToBday);
});//doc

  
