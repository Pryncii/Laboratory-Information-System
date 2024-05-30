$(document).ready(function(){
    $("#search-btn").click(function(){
      $.post(
        "search-Patients",
        {
            name: $("#sortName-btn").text(),
            date: $("#sortDate-btn").text(),
            sort: $("#hidden-chosenSort").val(),
            search: $("#search-field").val()
        },
        function(data, status){
            if(status === 'success'){
                $("#next-btn").attr("disabled", data.lockNext);
                $("#back-btn").attr("disabled", data.lockBack);
                $("#pageNumber").text(data.start + " out of " + data.end);
                $("#hidden-search").val("true");
                let pageData = data.pageData;
                let table = document.getElementById("pageData");
                table.innerHTML = "";
                let patients = "";
                for(let i = 0; i < pageData.length; i++){
                    patient = pageData[i];
                    patients += `
                        <tr>
                            <td class="item-container"><h5>${patient.name}</h5></td> 
                            <td class="item-container"><h5>${patient.latestDate}</h5></td> 
                            <td class="item-container"><h5>${patient.remarks}</h5></td>
                        </tr>
                    `
                }
                table.innerHTML = patients;
            }//if
        });//fn+post
    });//btn

    $("#sortName-btn").click(function(){
      $.post(
        "sort-Patients",
        {
            name: $("#sortName-btn").text(),
            hasSearched: $("#hidden-search").val(),
            search: $("#search-field").val()
        },
        function(data, status){
            if(status === 'success'){
                $("#next-btn").attr("disabled", data.lockNext);
                $("#back-btn").attr("disabled", data.lockBack);
                $("#sortName-btn").text(data.nameBtn_text);
                $("#pageNumber").text(data.start + " out of " + data.end);
                $("#hidden-chosenSort").val("N");
                let pageData = data.pageData;
                let table = document.getElementById("pageData");
                table.innerHTML = "";
                let patients = "";
                for(let i = 0; i < pageData.length; i++){
                    patient = pageData[i];
                    patients += `
                        <tr>
                            <td class="item-container"><h5>${patient.name}</h5></td> 
                            <td class="item-container"><h5>${patient.latestDate}</h5></td> 
                            <td class="item-container"><h5>${patient.remarks}</h5></td>
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
            date: $("#sortDate-btn").text(),
            hasSearched: $("#hidden-search").val(),
            search: $("#search-field").val()
        },
        function(data, status){
            if(status === 'success'){
                $("#next-btn").attr("disabled", data.lockNext);
                $("#back-btn").attr("disabled", data.lockBack);
                $("#sortDate-btn").text(data.dateBtn_text);
                $("#pageNumber").text(data.start + " out of " + data.end);
                $("#hidden-chosenSort").val("D");
                let pageData = data.pageData;
                let table = document.getElementById("pageData");
                table.innerHTML = "";
                let patients = "";
                for(let i = 0; i < pageData.length; i++){
                    patient = pageData[i];
                    patients += `
                        <tr>
                            <td class="item-container"><h5>${patient.name}</h5></td> 
                            <td class="item-container"><h5>${patient.latestDate}</h5></td> 
                            <td class="item-container"><h5>${patient.remarks}</h5></td>
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
            move: 0,
            hasSearched: $("#hidden-search").val(),
            search: $("#search-field").val()
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
                            <td class="item-container"><h5>${patient.name}</h5></td> 
                            <td class="item-container"><h5>${patient.latestDate}</h5></td> 
                            <td class="item-container"><h5>${patient.remarks}</h5></td>
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
            move: 1,
            hasSearched: $("#hidden-search").val(),
            search: $("#search-field").val()
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
                            <td class="item-container"><h5>${patient.name}</h5></td> 
                            <td class="item-container"><h5>${patient.latestDate}</h5></td> 
                            <td class="item-container"><h5>${patient.remarks}</h5></td>
                        </tr>
                    `
                }
                table.innerHTML = patients;
            }//if
        });//fn+post
    });//btn
});//doc

  