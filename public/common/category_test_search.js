$(document).ready(function(){
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
});