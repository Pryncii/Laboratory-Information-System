document.addEventListener("DOMContentLoaded", function() {
    const statusSelect = document.getElementById("editstatus");
    const startDateGroup = document.getElementById("start-date-group");
    const finishDateGroup = document.getElementById("finish-date-group");
    const startDateInput = document.getElementById("start-date");
    const finishDateInput = document.getElementById("finish-date");

    startDateGroup.style.display = "none";
    finishDateGroup.style.display = "none";

    statusSelect.addEventListener("change", function() {
        const currentDate = new Date().toISOString().split("T")[0];
        
        if (statusSelect.value === "in_progress") {
            startDateGroup.style.display = "block";
            finishDateGroup.style.display = "none";
            startDateInput.value = currentDate;
        } else if (statusSelect.value === "completed") {
            finishDateGroup.style.display = "block";
            startDateGroup.style.display = "none";
            finishDateInput.value = currentDate;
        } else {
            startDateGroup.style.display = "none";
            finishDateGroup.style.display = "none";
        }
    });

    const form = document.getElementById("status-form");
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        

        const formData = {
            status: statusSelect.value,
            startDate: startDateInput.value,
            finishDate: finishDateInput.value,
            remarks: document.getElementById("remarks").value
        };
        
        const url = "/update-status-request-db";

        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            form.reset();
            const modal = bootstrap.Modal.getInstance(document.getElementById("statusModal"));
            modal.hide();
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    });
        // Get the modal element
    var statusModal = document.getElementById("statusModal");

    // Listen for the modal opening event
    statusModal.addEventListener("show.bs.modal", function(event) {
        // Get the button that triggered the modal
        var button = event.relatedTarget;

        // Extract data from the clicked row
        var patientID = button.closest("tr").dataset.patientId;
        var patientName = button.closest("tr").dataset.patientName;
        var remarks = button.closest("tr").dataset.remarks;
        requestID = button.closest("tr").dataset.requestId;

        // Populate the modal with the extracted data
        var modalTitle = statusModal.querySelector(".modal-title");
        var userName = statusModal.querySelector("#user-name");
        var patientId = statusModal.querySelector("#patient-id");
        var remarksTextarea = statusModal.querySelector("#remarks");

        modalTitle.textContent = "Edit Status";
        userName.textContent = patientName;
        patientId.textContent = "Patient ID: " + patientID;
        remarksTextarea.placeholder = remarks;
    });

});