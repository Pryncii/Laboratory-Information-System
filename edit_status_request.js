document.addEventListener("DOMContentLoaded", function() {
    const statusSelect = document.getElementById("status");
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
        
        const url = "https://example.com/api/save-status";

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

});
