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

function generateTemplate(requestID, category) {
    if(category === "Hematology") {
        header = `
            <div class="item-label p-3 w-50 mx-2">
                CBC
            </div>
            <div class="custom-checkbox-wrapper p-3 w-50 mx-2">
                <input type="checkbox" class="btn-check" id="${requestID}-platelet-btn" autocomplete="off">
                <label class="btn btn-outline-primary custom-btn p-3 w-100" for="${requestID}-platelet-btn" onclick="showPlatelets('${requestID}')">with Platelets</label>
            </div>
        `
        content = `
            <table>
                <tr>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-hemoglobin" name="hemoglobin" placeholder="">
                            <label for="hemoglobin">Hemoglobin</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" id="${requestID}-hemoglobin-flag" class="form-control form-control-sm" disabled>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-hematocrit" name="hematocrit" placeholder="">
                            <label for="hematocrit">Hematocrit</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" id="${requestID}-hematocrit-flag" class="form-control form-control-sm" disabled>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-rbc-count" name="rbc-count" placeholder="">
                            <label for="rbc-count">RBC Count</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" id="${requestID}-rbc-count-flag" class="form-control form-control-sm" disabled>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-wbc-count" name="wbc-count" placeholder="">
                            <label for="wbc-count">WBC Count</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" id="${requestID}-wbc-count-flag" class="form-control form-control-sm" disabled>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-neutrophil" name="neutrophil" placeholder="">
                            <label for="neutrophil">Neutrophil</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" id="${requestID}-neutrophil-flag" class="form-control form-control-sm" disabled>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-lymphocite" name="lymphocite" placeholder="">
                            <label for="lymphocite">Lymphocite</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" id="${requestID}-lymphocite-flag" class="form-control form-control-sm" disabled>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-monocyte" name="monocyte" placeholder="">
                            <label for="monocyte">Monocyte</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" id="${requestID}-monocyte-flag" class="form-control form-control-sm" disabled>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-eosinophil" name="eosinophil" placeholder="">
                            <label for="eosinophil">Eosinophil</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" id="${requestID}-eosinophil-flag" class="form-control form-control-sm" disabled>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-basophil" name="basophil" placeholder="">
                            <label for="basophil">Basophil</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" id="${requestID}-basophil-flag" class="form-control form-control-sm" disabled>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2 invisible" id="${requestID}-platelet-lbl">
                            <input type="text" class="form-control text-center" id="${requestID}-platelet" name="platelet" placeholder="">
                            <label for="platelet">Platelet Count</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" id="${requestID}-platelet-flag" class="form-control form-control-sm invisible" disabled>
                        </div>
                    </td>
                </tr>
            </table>
            `
            submit = `
                <div class="my-3">
                    <button type="button" class="btn btn-primary btn-lg mx-2" id="${requestID}-submit" onclick="">Submit</button>
                </div>
            `
    } else if (category === "Clinical Microscopy") {
        header = `
            <div class="custom-checkbox-wrapper p-3 w-50 mx-2">
                <input type="radio" class="btn-check" name="options-outlined" id="${requestID}-urinalysis-btn" autocomplete="off" onclick="showClinicalMicroscopy('${requestID}')">
                <label class="btn btn-outline-primary custom-btn p-3 w-100" for="${requestID}-urinalysis-btn">Urinalysis</label>
            </div>
            <div class="custom-checkbox-wrapper p-3 w-50 mx-2">
                <input type="radio" class="btn-check" name="options-outlined" id="${requestID}-fecalysis-btn" autocomplete="off" onclick="showClinicalMicroscopy('${requestID}')">
                <label class="btn btn-outline-primary custom-btn p-3 w-100" for="${requestID}-fecalysis-btn">Fecalysis</label>
            </div>
        `
        content = `
            <table>
                <tr>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-color" name="color" placeholder="">
                            <label for="color">Color</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-transparency" name="transparency" placeholder="">
                            <label for="transparency">Transparency</label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-ph" name="ph" placeholder="">
                            <label for="ph">pH</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-specific-gravity" name="specific-gravity" placeholder="">
                            <label for="specific-gravity">Specific Gravity</label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-sugar" name="sugar" placeholder=""> 
                            <label for="sugar">Sugar</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-protein" name="protein" placeholder="">
                            <label for="protein">Protein</label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-pus" name="pus" placeholder="">
                            <label for="pus">Pus</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-rbc" name="rbc" placeholder="">
                            <label for="rbc">RBC</label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-bacteria" name="bacteria" placeholder="">
                            <label for="bacteria">Bacteria</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2" id="${requestID}-epithelial-cells-lbl">
                            <input type="text" class="form-control text-center" id="${requestID}-epithelial-cells" name="epithelial-cells" placeholder="">
                            <label for="epithelial-cells">Epithelial Cells</label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-mucus-thread" name="mucus-thread" placeholder="">
                            <label for="mucus-thread">Mucus Thread</label>
                        </div>
                    </td>
                </tr>
            </table>
            `
            submit = `
                <div class="my-3">
                    <button type="button" class="btn btn-primary btn-lg mx-2" id="${requestID}-submit" onclick="">Submit</button>
                </div>
            `
    } else if (category === "Chemistry") {
        header = `
            <div class="item-label p-3 m-2 w-100">
                Chemistry
            </div>
        `
        content = `
            <table>
                <tr>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-fbs" name="fbs" placeholder="">
                            <label for="fbs">FBS</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" id="${requestID}-fbs-flag" class="form-control form-control-sm" disabled>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-creatinine" name="creatinine" placeholder="">
                            <label for="creatinine">Creatinine</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" id="${requestID}-creatinine-flag" class="form-control form-control-sm" disabled>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-uric-acid" name="uric-acid" placeholder="">
                            <label for="uric-acid">Uric Acid</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" id="${requestID}-uric-acid-flag" class="form-control form-control-sm" disabled>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-cholesterol" name="cholesterol" placeholder="">
                            <label for="cholesterol">Cholesterol</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" id="${requestID}-cholesterol-flag" class="form-control form-control-sm" disabled>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-triglycerides" name="triglycerides" placeholder="">
                            <label for="triglycerides">Triglycerides</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" id="${requestID}-triglycerides-flag" class="form-control form-control-sm" disabled>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-hdl" name="hdl" placeholder="">
                            <label for="hdl">HDL</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" id="${requestID}-hdl-flag" class="form-control form-control-sm" disabled>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-ldl" name="ldl" placeholder="">
                            <label for="ldl">LDL</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" id="${requestID}-ldl-flag" class="form-control form-control-sm" disabled>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-vldl" name="vldl" placeholder="">
                            <label for="vldl">VLDL</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" id="${requestID}-vldl-flag" class="form-control form-control-sm" disabled>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-bun" name="bun" placeholder="">
                            <label for="bun">BUN</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" id="${requestID}-bun-flag" class="form-control form-control-sm" disabled>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2" id="${requestID}-sgpt-lbl">
                            <input type="text" class="form-control text-center" id="${requestID}-sgpt" name="sgpt" placeholder="">
                            <label for="sgpt">SGPT</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" id="${requestID}-sgpt-flag" class="form-control form-control-sm" disabled>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-sgot" name="sgot" placeholder="">
                            <label for="sgot">SGOT</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" id="${requestID}-sgot-flag" class="form-control form-control-sm" disabled>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-hba1c" name="hba1c" placeholder="">
                            <label for="hba1c">HbA1c</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" id="${requestID}-hba1c-flag" class="form-control form-control-sm" disabled>
                        </div>
                    </td>
                </tr>
            </table>
            `
            submit = `
                <div class="my-3">
                    <button type="button" class="btn btn-primary btn-lg mx-2" id="${requestID}-submit" onclick="">Submit</button>
                </div>
            `
    } else if (category === "Serology") {
        header = `
            <div class="item-label p-3 m-2 w-100">
                Serology
            </div>
        `
        content = `
            <table>
                <tr>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-hbsag" name="hbsag" placeholder="">
                            <label for="hbsag">HbsAg</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-rpr-vdrl" name="rpr-vdrl" placeholder="">
                            <label for="rpr-vdrl">RPR/VDRL</label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-pregnancy-test" name="pregnancy-test" placeholder=""> 
                            <label for="pregnancy-test">Pregnancy Test (UA/SERUM)</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-dengue-ns1" name="dengue-ns1" placeholder="">
                            <label for="dengue-ns1">DENGUE NS1</label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-dengue-duo" name="dengue-duo" placeholder="">
                            <label for="dengue-duo">DENGUE DUO</label>
                        </div>
                    </td>
                </tr>
            </table>
            `
            submit = `
                <div class="my-3">
                    <button type="button" class="btn btn-primary btn-lg mx-2" id="${requestID}-submit" onclick="">Submit</button>
                </div>
            `
    }
    $(`#${requestID}-header`).html(header);
    $(`#${requestID}-content`).html(content);
    $(`#${requestID}-submit`).html(submit);
    $(`#${requestID}-urinalysis-btn`).prop('checked', true);
    $(`#ModalLabel-${requestID}`).html(category);
}

function showPlatelets(requestID) {
    if ($(`#${requestID}-platelet-btn`).prop('checked')) {
        $(`#${requestID}-platelet-lbl`).addClass('invisible');
        $(`#${requestID}-platelet-flag`).addClass('invisible');
    } else {
        $(`#${requestID}-platelet-lbl`).removeClass('invisible');
        $(`#${requestID}-platelet-flag`).removeClass('invisible');
    }
}

function showClinicalMicroscopy(requestID) {
    if ($(`#${requestID}-urinalysis-btn`).prop('checked')) {
        content = `
            <table>
                <tr>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-color" name="color" placeholder="">
                            <label for="color">Color</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-transparency" name="transparency" placeholder="">
                            <label for="transparency">Transparency</label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-ph" name="ph" placeholder="">
                            <label for="ph">pH</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-specific-gravity" name="specific-gravity" placeholder="">
                            <label for="specific-gravity">Specific Gravity</label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-sugar" name="sugar" placeholder="">
                            <label for="sugar">Sugar</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-protein" name="protein" placeholder="">
                            <label for="protein">Protein</label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-pus" name="pus" placeholder="">
                            <label for="pus">Pus</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-rbc" name="rbc" placeholder="">
                            <label for="rbc">RBC</label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-bacteria" name="bacteria" placeholder="">
                            <label for="bacteria">Bacteria</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2" id="${requestID}-epithelial-cells-lbl">
                            <input type="text" class="form-control text-center" id="${requestID}-epithelial-cells" name="epithelial-cells" placeholder="">
                            <label for="epithelial-cells">Epithelial Cells</label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-mucus-thread" name="mucus-thread" placeholder="">
                            <label for="mucus-thread">Mucus Thread</label>
                        </div>
                    </td>
                </tr>
            </table>
            `
    } else if ($(`#${requestID}-fecalysis-btn`).prop('checked')) {
        content = `
            <table>
                <tr>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-color" name="color" placeholder="">
                            <label for="color">Color</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-consistency" name="consistency" placeholder=""> 
                            <label for="consistency">Consistency</label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-wbc" name="wbc" placeholder="">
                            <label for="wbc">WBC</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-rbc" name="rbc" placeholder="">
                            <label for="rbc">RBC</label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-ova-parasite" name="ova-parasite" placeholder="">
                            <label for="ova-parasite">Ova/Parasite</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-fat-globule" name="fat-globule" placeholder="">
                            <label for="fat-globule">Fat Globule</label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-bile-crystal" name="bile-crystal" placeholder="">
                            <label for="bile-crystal">Bile Crystal</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-vegetable-fiber" name="vegetable-fiber" placeholder="">
                            <label for="vegetable-fiber">Vegetable Fiber</label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-meat-fiber" name="meat-fiber" placeholder="">
                            <label for="meat-fiber">Meat Fiber</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2" id="${requestID}-pus-cells-lbl">
                            <input type="text" class="form-control text-center" id="${requestID}-pus-cells" name="pus-cells" placeholder="">
                            <label for="pus-cells">Pus Cells</label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-erythrocyte" name="erythrocyte" placeholder="">
                            <label for="erythrocyte">Erythrocyte</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-yeast-cell" name="yeast-cell" placeholder="">
                            <label for="yeast-cell">Yeast Cell</label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-bacteria" name="bacteria" placeholder="">
                            <label for="bacteria">Bacteria</label>
                        </div>
                    </td>
                </tr>
            </table>
            `
    }
    $(`#${requestID}-content`).html(content);
}
