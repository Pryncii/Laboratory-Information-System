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
                $("#hidden-chosenSort").val("N");
                let pageData = data.pageData;
                let table = document.getElementById("pageData");
                table.innerHTML = "";
                let patients = "";
                for(let i = 0; i < pageData.length; i++){
                    patient = pageData[i];
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
                $("#hidden-chosenSort").val("D");
                let pageData = data.pageData;
                let table = document.getElementById("pageData");
                table.innerHTML = "";
                let patients = "";
                for(let i = 0; i < pageData.length; i++){
                    patient = pageData[i];
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

    $("#back-btn").click(function(){
      $.post(
        "move-Page",
        {
            name: $("#sortName-btn").text(),
            date: $("#sortDate-btn").text(),
            pageNum: $("#pageNumber").text(),
            sort: $("#hidden-chosenSort").val(),
            move: 0
        },
        function(data, status){
            if(status === 'success'){
                $("#next-btn").attr("disabled", data.lockNext);
                $("#back-btn").attr("disabled", data.lockBack);
                $("#pageNumber").text(data.start + " out of " + data.end);
                let pageData = data.pageData;
                let table = document.getElementById("pageData");
                table.innerHTML = "";
                let patients = "";
                for(let i = 0; i < pageData.length; i++){
                    patient = pageData[i];
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

    $("#next-btn").click(function(){
      $.post(
        "move-Page",
        {
            name: $("#sortName-btn").text(),
            date: $("#sortDate-btn").text(),
            pageNum: $("#pageNumber").text(),
            sort: $("#hidden-chosenSort").val(),
            move: 1
        },
        function(data, status){
            if(status === 'success'){
                $("#next-btn").attr("disabled", data.lockNext);
                $("#back-btn").attr("disabled", data.lockBack);
                $("#pageNumber").text(data.start + " out of " + data.end);
                let pageData = data.pageData;
                let table = document.getElementById("pageData");
                table.innerHTML = "";
                let patients = "";
                for(let i = 0; i < pageData.length; i++){
                    patient = pageData[i];
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

  