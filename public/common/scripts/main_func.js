$(document).ready(function() {
    $(document).on('keypress', function(e) {
        if (e.which === 13) { // 13 is the keycode for Enter key
            $('#searchbtn').click();
            $('#search-btn').click();
        }
    });
    $('#category').change(function() {
        var category = $(this).val();
        var $testSelect = $('#tests');
        var $options = $testSelect.find('option');

        $options.hide();  // Hide all options initially

        // Show options based on selected category
        if (category === 'AA') {
            $options.show();  // Show all options
            $testSelect.val($testSelect.find('option:first').val());  // Set value to the first option
        } else if (category === 'Hematology') {
            showCategoryOptions('h-cat');
        } else if (category === 'Clinical Microscopy') {
            showCategoryOptions('cm-cat');
        } else if (category === 'Chemistry') {
            showCategoryOptions('c-cat');
        } else if (category === 'Serology') {
            showCategoryOptions('s-cat');
        }
    });

    function showCategoryOptions(categoryClass) {
        $('#tests .' + categoryClass).show();  // Show options of the selected category
        $('#tests').val($('#tests .' + categoryClass + ':first').val());  // Set value to the first option of the selected category
    }

    function getSomeValueFromUrl() {
        var pathArray = window.location.pathname.split('/');
        return pathArray[pathArray.length - 1]; // Get the last segment of the URL path
    }

    $("#backButton").click(function() {
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
        } else console.error('someValue not found in URL');
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
            } else console.error('Failed to fetch data');
        });
    } else console.error('someValue not found in URL');
    });
});