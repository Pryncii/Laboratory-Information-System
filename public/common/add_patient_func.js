function checkAgeToBday(event){
    let bday = $("#bday").val() ? new Date($("#bday").val()) : false;
    let age = parseInt($("#age").val());
    if(age && bday){
        $("#message").text(age +" "+bday);
        let now = new Date();

        let checkAge = now.getFullYear() - bday.getFullYear();

        const birthMonth = bday.getMonth();
        const nowMonth = now.getMonth();
        const bdayDay = bday.getDate();
        const nowDay = now.getDate();

        if(nowMonth < bdayMonth || (nowMonth === bdayMonth && nowDay < bdayDay)) {
            checkAge--;
        }

        if(age == checkAge){
            $("#message").text("yay");
        }
        else{
            $("#message").text("nooooo");
            //insert html changes
        }
    }
    else{
        $("#message").text("no age and or bday");
    }
}

$(document).ready(function(){
    $('#bday').on('change', checkAgeToBday);
    $('#age').on('change', checkAgeToBday);
});//doc

  