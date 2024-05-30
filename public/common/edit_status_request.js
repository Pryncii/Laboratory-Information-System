document.addEventListener("DOMContentLoaded", function() {
    let statusSelect = document.getElementById("editstatus");
    let startDateGroup = document.getElementById("start-date-group");
    let finishDateGroup = document.getElementById("finish-date-group");
    let startDateInput = document.getElementById("start-date");
    let finishDateInput = document.getElementById("finish-date");
    let reqIDval = document.getElementById("request-id");

    startDateGroup.style.display = "none";
    finishDateGroup.style.display = "none";

    statusSelect.addEventListener("change", function() {
        let currentDate = new Date().toISOString().split("T")[0];
        
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

    let form = document.getElementById("status-form");
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        

        let formData = {
            requestID: parseInt(reqIDval.outerText),
            status: statusSelect.value,
            startDate: startDateInput.value,
            finishDate: finishDateInput.value,
            remarks: document.getElementById("remarks").value
        };
        
        console.log(formData);

        const url = "/update-status-request-db";

        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
        .then(window.location.reload())
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
        var requestID = button.closest("tr").dataset.requestId;

        // Populate the modal with the extracted data
        var modalTitle = statusModal.querySelector(".modal-title");
        var userName = statusModal.querySelector("#user-name");
        var patientId = statusModal.querySelector("#patient-id");
        var requestId = statusModal.querySelector("#request-id");
        var remarksTextarea = statusModal.querySelector("#remarks");

        modalTitle.textContent = "Edit Status";
        userName.textContent = patientName;
        patientId.textContent = "Patient ID: " + patientID;
        requestId.textContent = requestID;
        remarksTextarea.placeholder = remarks;
    });
});