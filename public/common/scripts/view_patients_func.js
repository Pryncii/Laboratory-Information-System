$(document).ready(function(){
    $(document).on('keypress', function(e) {
        if (e.which === 13) { // 13 is the keycode for Enter key
            $('#searchbtn').click();
            $('#search-btn').click();
        }
    });
    $("#search-btn").click(function(){
      $.post(
        "search-patients",
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
                $("#pageNumber").html("<h5> Page " + data.start + " of " + data.end + "</h5>");
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
        "sort-patients",
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
                $("#pageNumber").html("<h5> Page " + data.start + " of " + data.end + "</h5>");
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
        "sort-patients",
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
                $("#pageNumber").html("<h5> Page " + data.start + " of " + data.end + "</h5>");
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

    $("#reset-btn").click(function(){
        $.post(
          "reset-page",
          {

          },
          function(data, status){
              if(status === 'success'){
                $("#next-btn").attr("disabled", data.lockNext);
                $("#back-btn").attr("disabled", data.lockBack);
                $("#sortName-btn").text("Last Name A-Z");
                $("#sortDate-btn").text("Recently Modified");
                $("#hidden-search").val("false");
                $("#hidden-chosenSort").val("D");
                $("#pageNumber").html("<h5> Page " + data.start + " of " + data.end + "</h5>");
                $("#search-field").val("");
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
        "move-page",
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
                $("#pageNumber").html("<h5> Page " + data.start + " of " + data.end + "</h5>");
                let pageData = data.pageData;
                let table = document.getElementById("pageData");
                table.innerHTML = "";
                let patients = "";
                for(let i = 0; i < pageData.length; i++){
                    patient = pageData[i];
                    patients += `
                        <tr>
                            <td class="item-container" ><a href="/patient-history/${patient.patientID}"><h5>${patient.name}</h5></a></td> 
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
        "move-page",
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
                $("#pageNumber").html("<h5> Page " + data.start + " of " + data.end + "</h5>");
                let pageData = data.pageData;
                let table = document.getElementById("pageData");
                table.innerHTML = "";
                let patients = "";
                for(let i = 0; i < pageData.length; i++){
                    patient = pageData[i];
                    patients += `
                        <tr>
                            <td class="item-container" ><a href="/patient-history/${patient.patientID}"><h5>${patient.name}</h5></a></td>  
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

  