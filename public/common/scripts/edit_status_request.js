document.addEventListener("DOMContentLoaded", function () {
    let statusSelect = document.getElementById("edit-status");
    let payStatusSelect = document.getElementById("payment-status");
    let reqIDval = document.getElementById("request-id");

    let form = document.getElementById("status-form");
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        let formData = {
            requestID: parseInt(reqIDval.outerText),
            status: statusSelect.value,
            payStatus: payStatusSelect.value,
            remarks: document.getElementById("remarks").value,
        };

        console.log(formData);

        const url = "/update-status-request-db";

        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
            .then(window.location.reload())
            .catch((error) => {
                console.error("Error:", error);
            });
    });
    // Get the modal element
    var statusModal = document.getElementById("statusModal");

    // Listen for the modal opening event
    statusModal.addEventListener("show.bs.modal", function (event) {
        // Get the button that triggered the modal
        var button = event.relatedTarget;

        // Extract data from the clicked row
        var patientID = button.closest("tr").dataset.patientId;
        var patientName = button.closest("tr").dataset.patientName;
        var remarks = button.closest("tr").dataset.remarks;
        var requestID = button.closest("tr").dataset.requestId;
        let reqStatus = button.closest("tr").dataset.status;
        let payStatus = button.closest("tr").dataset.payStatus;

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
        statusSelect.value = reqStatus;
        payStatusSelect.value = payStatus;
    });

    document.querySelector(".close-pdf").onclick = function () {
        const modal = document.getElementById("pdfModal");
        modal.style.display = "none";
    };

    window.onclick = function (event) {
        const modal = document.getElementById("pdfModal");
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
});

function flag(parameter, value, gender) {
    let ranges = {
        Hemoglobin: {
            M: [140.0, 180.0],
            F: [120.0, 160.0],
        },
        Hematocrit: {
            M: [0.4, 0.54],
            F: [0.35, 0.48],
        },
        RBC: {
            M: [4.5, 6.0],
            F: [4.0, 5.5],
        },
    };
    let range = ranges[parameter][gender];
    if (value > range[1]) {
        return "HIGH";
    } else if (value < range[0]) {
        return "LOW";
    } else {
        return "Normal";
    }
}

function flag2(parameter, value) {
    let ranges = {
        WBC: [5.0, 10.0],
        Neutrophil: [0.5, 0.75],
        Lymphocyte: [0.25, 0.4],
        Monocyte: [0.02, 0.06],
        Eosinophil: [0.01, 0.04],
        Basophil: [0, 0.01],
        Platelet: [145, 450],
    };
    let range = ranges[parameter];
    if (value > range[1]) {
        return "HIGH";
    } else if (value < range[0]) {
        return "LOW";
    } else {
        return "Normal";
    }
}

function generateTemplate(requestID, category, patientName, age, sex, alltests) {
    test = alltests.includes(', ') ? alltests.split(', ') : [alltests];
    if (category == "Hematology" || category == "Chemistry") {
        header = `
            <div class="item-label p-3 w-100 mx-2">
                ${category}
            </div>
        `;
        content = `
            <table class="w-100">
        `;
        for (var i = 0; i < test.length; i++) {
            if (test[i].includes(' ')) {
                var name = test[i].replace(/ /g, '').toLowerCase();
            } else {
                var name = test[i].toLowerCase();
            }
            if (test[0] == 'CBC' || test[0] == 'CBC with Platelet Count') {
                if (i % 2 == 1) {
                    content += "<tr>";
                }
            } else {
                if (i % 2 == 0) {
                    content += "<tr>";
                }
            }
            if (test[i] == 'CBC' || test[i] == 'CBC with Platelet Count') {
                content += `
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
                            <input type="text" class="form-control text-center" id="${requestID}-lymphocyte" name="lymphocyte" placeholder="">
                            <label for="lymphocyte">Lymphocite</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" id="${requestID}-lymphocyte-flag" class="form-control form-control-sm" disabled>
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
                `;
                if (test[i] == 'CBC') {
                    content += `
                    <td colspan=2>
                        <div class="form-floating m-2">
                            <select class="form-control text-center" id="${requestID}-plateletdesc" name="plateletdesc" placeholder="">
                                <option value="Inadequate">Inadequate</option>
                                <option value="Adequate">Adequate</option>
                            </select>
                            <label for="plateletdesc">Platelet</label>
                        </div>
                    </td>
                    `
                } else {
                    content += `
                    <td>
                        <div class="form-floating m-2 id="${requestID}-platelet-lbl">
                            <input type="text" class="form-control text-center" id="${requestID}-platelet" name="platelet" placeholder="">
                            <label for="platelet">Platelet Count</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" id="${requestID}-platelet-flag" class="form-control form-control-sm" disabled>
                        </div>
                    </td>
                    `
                }
                content += `
                </tr>
                `;
            } else {
                content += `
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-${name}" name="${name}" placeholder="">
                            <label for="${name}">${test[i]}</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" id="${requestID}-${name}-flag" class="form-control form-control-sm" disabled>
                        </div>
                    </td>
                `;
            }
            if (test[0] == 'CBC' || test[0] == 'CBC with Platelet Count') {
                if (i % 2 == 0) {
                    content += "</tr>";
                }
            } else {
                if (i % 2 == 1) {
                    content += "</tr>";
                }
            }
        }
        content += `
            </table>

        `;
    } else if (category == "Clinical Microscopy") {
        header = `
            <div class="item-label p-3 w-100 mx-2">
                ${test}
            </div>
        `;
        if (test == 'Urinalysis') {
            content = `
                <table class="w-100">
                    <tr>
                        <td>
                            <div class="form-floating m-2">
                                <input type="text" class="form-control text-center" id="${requestID}-urinalysis-color" name="color" placeholder="">
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
                                <input type="text" class="form-control text-center" id="${requestID}-urinalysis-bacteria" name="bacteria" placeholder="">
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
            `;

        } else if (test == 'Fecalysis') {
            content = `
                <table class="w-100">
                    <tr>
                        <td>
                            <div class="form-floating m-2">
                                <input type="text" class="form-control text-center" id="${requestID}-fecalysis-color" name="color" placeholder="">
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
                                <input type="text" class="form-control text-center" id="${requestID}-fecalysis-bacteria" name="bacteria" placeholder="">
                                <label for="bacteria">Bacteria</label>
                            </div>
                        </td>
                    </tr>
                </table>
            `;
        }
    } else if (category == "Serology") {
        header = `
            <div class="item-label p-3 m-2 w-100">
                ${category}
            </div>
        `;
        content = `
            <table class="w-100">
        `;
        for (var i = 0; i < test.length; i++) {
            if (test[i].includes(' ')) {
                var name = test[i].replace(/ /g, '').toLowerCase();
            } else {
                var name = test[i].toLowerCase();
            }
            if (i % 2 == 0) {
                content += "<tr>";
            }
            if (test[i] == "Serum Pregnancy Test" || test[i] == "Urine Pregnancy Test") {
                content += `
                    <td>
                        <div class="form-floating m-2">
                            <select class="form-control text-center" id="${requestID}-${name}" name="${name}" placeholder="">
                                <option value="Positive">Positive</option>
                                <option value="Negative">Negative</option>
                            </select>
                            <label for="${name}">${test[i]}</label>
                        </div>
                    </td>
                `;
            } else {
                content += `
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-${name}" name="${name}" placeholder="">
                            <label for="${name}">${test[i]}</label>
                        </div>
                    </td>
                `;
            }
            if (i % 2 == 1) {
                content += "</tr>";
            }
        }
        content += `
            </table>

        `;
    }
    submit = `
        <div class="my-3">
            <button type="button" class="btn btn-primary btn-lg mx-2" id="${requestID}-submit" onclick="saveChanges('${requestID}', '${category}')">Submit</button>
            <button type="button" class="btn btn-primary btn-lg mx-2" id="${requestID}-pdfsubmit" onclick="generatePDF('${requestID}','${category}', '${patientName}', '${age}', '${sex}')">Save to PDF</button>
        </div>
    `;
    $(`#${requestID}-header`).html(header);
    $(`#${requestID}-content`).html(content);
    $(`#${requestID}-submit`).html(submit);
    $(`#${requestID}-urinalysis-btn`).prop("checked", true);
    $(`#ModalLabel-${requestID}`).html(category);
    const id = ["hemoglobin", "hematocrit", "rbc-count"];
    const parameter = ["Hemoglobin", "Hematocrit", "RBC"];
    for (let i = 0; i < 3; i++) {
        let input = document.getElementById(requestID + "-" + id[i]);
        let inputflag = document.getElementById(requestID + "-" + id[i] + "-flag");
        input.addEventListener("input", function (event) {
            let index = i;
            if (input.value === "") {
                inputflag.value = "";
            } else {
                let currentPath = window.location.pathname;
                let endpoint = currentPath + "/gender/" + requestID;
                $.get(endpoint, function (data, status) {
                    if (status === "success") {
                        const gender = data.gender;
                        inputflag.value = flag(
                            parameter[index],
                            parseFloat(input.value),
                            gender
                        );
                    }
                });
            }
        });
    }
    const id2 = [
        "wbc-count",
        "neutrophil",
        "lymphocyte",
        "monocyte",
        "eosinophil",
        "basophil",
        "platelet",
    ];
    const parameter2 = [
        "WBC",
        "Neutrophil",
        "Lymphocyte",
        "Monocyte",
        "Eosinophil",
        "Basophil",
        "Platelet",
    ];
    for (let i = 0; i < 7; i++) {
        let input = document.getElementById(requestID + "-" + id2[i]);
        let inputflag = document.getElementById(requestID + "-" + id2[i] + "-flag");
        input.addEventListener("input", function (event) {
            let index = i;
            if (input.value === "") {
                inputflag.value = "";
            } else {
                inputflag.value = flag2(parameter2[index], parseFloat(input.value));
            }
        });
    }
}

function showPlatelets(requestID) {
    if ($(`#${requestID}-platelet-btn`).prop("checked")) {
        $(`#${requestID}-platelet-lbl`).addClass("invisible");
        $(`#${requestID}-platelet-flag`).addClass("invisible");
    } else {
        $(`#${requestID}-platelet-lbl`).removeClass("invisible");
        $(`#${requestID}-platelet-flag`).removeClass("invisible");
    }
}

function saveChanges(requestID, category) {
    let data = [];
    if (category === "Hematology") {
        let pltc = $(`#${requestID}-platelet-btn`).prop('checked')
            ? $("#" + requestID + "-platelet").val()
            : "";

        data.push({
            hemo: $("#" + requestID + "-hemoglobin").val(),
            hema: $("#" + requestID + "-hematocrit").val(),
            rbc: $("#" + requestID + "-rbc-count").val(),
            wbc: $("#" + requestID + "-wbc-count").val(),
            neut: $("#" + requestID + "-neutrophil").val(),
            lymp: $("#" + requestID + "-lymphocyte").val(),
            mono: $("#" + requestID + "-monocyte").val(),
            eosi: $("#" + requestID + "-eosinophil").val(),
            baso: $("#" + requestID + "-basophil").val(),
            pltc: pltc,
        });

    } else if (category === "Clinical Microscopy") {
        if ($(`#${requestID}-urinalysis-btn`).prop('checked')) {
            category = "Urinalysis";
            data.push({
                clr: $("#" + requestID + "-urinalysis-color").val(),
                trans: $("#" + requestID + "-transparency").val(),
                ph: $("#" + requestID + "-ph").val(),
                spgrav: $("#" + requestID + "-specific-gravity").val(),
                sug: $("#" + requestID + "-sugar").val(),
                pro: $("#" + requestID + "-protein").val(),
                pus: $("#" + requestID + "-pus").val(),
                rbc: $("#" + requestID + "-rbc").val(),
                bac: $("#" + requestID + "-urinalysis-bacteria").val(),
                epi: $("#" + requestID + "-epithelial-cells").val(),
                muc: $("#" + requestID + "-mucus-thread").val(),
            });
        }
        else if ($(`#${requestID}-fecalysis-btn`).prop('checked')) {
            category = "Fecalysis";
            data.push({
                clr: $("#" + requestID + "-fecalysis-color").val(),
                cons: $("#" + requestID + "-consistency").val(),
                wbc: $("#" + requestID + "-wbc").val(),
                rbc: $("#" + requestID + "-rbc").val(),
                ovapar: $("#" + requestID + "-ova-parasite").val(),
                fat: $("#" + requestID + "-fat-globule").val(),
                bile: $("#" + requestID + "-bile-crystal").val(),
                veg: $("#" + requestID + "-vegetable-fiber").val(),
                meat: $("#" + requestID + "-meat-fiber").val(),
                pus: $("#" + requestID + "-pus-cells").val(),
                eryth: $("#" + requestID + "-erythrocyte").val(),
                yeast: $("#" + requestID + "-yeast-cell").val(),
                bac: $("#" + requestID + "-fecalysis-bacteria").val(),
            });
        }

    } else if (category === "Chemistry") {
        category = "Chemistry";
        data.push({
            fbs: $("#" + requestID + "-fbs").val(),
            crt: $("#" + requestID + "-creatinine").val(),
            uric: $("#" + requestID + "-uric-acid").val(),
            chol: $("#" + requestID + "-cholesterol").val(),
            tri: $("#" + requestID + "-triglycerides").val(),
            hdl: $("#" + requestID + "-hdl").val(),
            ldl: $("#" + requestID + "-ldl").val(),
            vldl: $("#" + requestID + "-vldl").val(),
            bun: $("#" + requestID + "-bun").val(),
            sgpt: $("#" + requestID + "-sgpt").val(),
            sgot: $("#" + requestID + "-sgot").val(),
            hba1c: $("#" + requestID + "-hba1c").val(),
        });

    } else if (category === "Serology") {
        category = "Serology";
        data.push({
            hbsag: $("#" + requestID + "-hbsag").val(),
            rprvdrl: $("#" + requestID + "-rpr-vdrl").val(),
            pregs: $("#" + requestID + "-pregnancy-test-serum").val(),
            pregu: $("#" + requestID + "-pregnancy-test-urine").val(),
            dengN: $("#" + requestID + "-dengue-ns1").val(),
            dengD: $("#" + requestID + "-dengue-duo").val(),
        });
    }

    let currentPath = window.location.pathname;
    let endpoint = currentPath + "/save-edit-request";


    $('#Modal-' + requestID).modal('hide');

    $.post(
        endpoint,
        {
            requestID: requestID,
            category: category,
            data: data,
        },
        function (response, status) {
            if (status === 'success' && response.redirect) {
                // Redirect to the new URL
                window.location.href = response.redirect;
            }

        });//fn+post
}

async function generatePDF(requestID, category, patientName, age, sex) {
        let data = [];
    
        if (category === "Hematology") {
            category = "hematology";
            let pltc = $(`#${requestID}-platelet-btn`).prop('checked') 
            ? $("#" + requestID + "-platelet").val() 
            : "";
            data.push({
            name: patientName,
            age: age,
            sex: sex,
            hemo: $("#" + requestID + "-hemoglobin").val(),
            hema: $("#" + requestID + "-hematocrit").val(),
            rbc: $("#" + requestID + "-rbc-count").val(),
            wbc: $("#" + requestID + "-wbc-count").val(),
            neut: $("#" + requestID + "-neutrophil").val(),
            lymp: $("#" + requestID + "-lymphocyte").val(),
            mono: $("#" + requestID + "-monocyte").val(),
            eosi: $("#" + requestID + "-eosinophil").val(),
            baso: $("#" + requestID + "-basophil").val(),
            pltc: pltc
            });
        } else if (category === "Clinical Microscopy") {
            category = "clinical-microscopy";
            if($(`#${requestID}-urinalysis-btn`).prop('checked')){
                data.push({
                    name: patientName,
                    age: age,
                    sex: sex,
                    clr: $("#" + requestID + "-urinalysis-color").val(),
                    trans: $("#" + requestID + "-transparency").val(),
                    ph: $("#" + requestID + "-ph").val(),
                    spgrav: $("#" + requestID + "-specific-gravity").val(),
                    sug: $("#" + requestID + "-sugar").val(),
                    pro: $("#" + requestID + "-protein").val(),
                    pus: $("#" + requestID + "-pus").val(),
                    rbc: $("#" + requestID + "-rbc").val(),
                    bac: $("#" + requestID + "-urinalysis-bacteria").val(),
                    epi: $("#" + requestID + "-epithelial-cells").val(),
                    muc: $("#" + requestID + "-mucus-thread").val()
                });
            }
            else if($(`#${requestID}-fecalysis-btn`).prop('checked')){
                category = "clinical-microscopy";
                data.push({
                    name: patientName,
                    age: age,
                    sex: sex,
                    clr: $("#" + requestID + "-fecalysis-color").val(),
                    cons: $("#" + requestID + "-consistency").val(),
                    wbc: $("#" + requestID + "-wbc").val(),
                    rbc: $("#" + requestID + "-rbc").val(),
                    ovapar: $("#" + requestID + "-ova-parasite").val(),
                    fat: $("#" + requestID + "-fat-globule").val(),
                    bile: $("#" + requestID + "-bile-crystal").val(),
                    veg: $("#" + requestID + "-vegetable-fiber").val(),
                    meat: $("#" + requestID + "-meat-fiber").val(),
                    pus: $("#" + requestID + "-pus-cells").val(),
                    eryth: $("#" + requestID + "-erythrocyte").val(),
                    yeast: $("#" + requestID + "-yeast-cell").val(),
                    bac: $("#" + requestID + "-fecalysis-bacteria").val()
                });
            }
        } else if (category === "Chemistry") {
            category = "chemistry";
            data.push({
                name: patientName,
                age: age,
                sex: sex,
                fbs: $("#" + requestID + "-fbs").val(),
                crt: $("#" + requestID + "-creatinine").val(),
                uric: $("#" + requestID + "-uric-acid").val(),
                chol: $("#" + requestID + "-cholesterol").val(),
                tri: $("#" + requestID + "-triglycerides").val(),
                hdl: $("#" + requestID + "-hdl").val(),
                ldl: $("#" + requestID + "-ldl").val(),
                vldl: $("#" + requestID + "-vldl").val(),
                bun: $("#" + requestID + "-bun").val(),
                sgpt: $("#" + requestID + "-sgpt").val(),
                sgot: $("#" + requestID + "-sgot").val(),
                hba1c: $("#" + requestID + "-hba1c").val()
            });
        } else if (category === "Chemistry") {
        category = "chemistry";
        data.push({
            fbs: $("#" + requestID + "-fbs").val(),
            crt: $("#" + requestID + "-creatinine").val(),
            uric: $("#" + requestID + "-uric-acid").val(),
            chol: $("#" + requestID + "-cholesterol").val(),
            tri: $("#" + requestID + "-triglycerides").val(),
            hdl: $("#" + requestID + "-hdl").val(),
            ldl: $("#" + requestID + "-ldl").val(),
            vldl: $("#" + requestID + "-vldl").val(),
            bun: $("#" + requestID + "-bun").val(),
            sgpt: $("#" + requestID + "-sgpt").val(),
            sgot: $("#" + requestID + "-sgot").val(),
            hba1c: $("#" + requestID + "-hba1c").val()
        });
    } else if (category === "Serology") {
        category = "serology";
        data.push({
            hbsag: $("#" + requestID + "-hbsag").val(),
            rprvdrl: $("#" + requestID + "-rpr-vdrl").val(),
            preg: $("#" + requestID + "-pregnancy-test").val(),
            dengN: $("#" + requestID + "-dengue-ns1").val(),
            dengD: $("#" + requestID + "-dengue-duo").val()
        });
    }

    const response = await fetch('/generate-pdf-' + category, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
        });
    
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
    
            // Display the PDF in the iframe
            const pdfFrame = document.getElementById('pdfFrame');
            pdfFrame.src = url;
    
            // Show the modal
            const modal = document.getElementById('pdfModal');
            modal.style.display = 'block';
    
            document.querySelector(".close-pdf").onclick = function () {
                const modal = document.getElementById("pdfModal");
                modal.style.display = "none";
            }
        
            document.getElementById('pdfModal').onclick = function () {
                const modal = document.getElementById("pdfModal");
                modal.style.display = "none";
            }
    
            // Enable the download button
            const downloadBtn = document.getElementById('downloadBtn');
                downloadBtn.onclick = () => {
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `Result_${requestID}.pdf`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                };

                const emailBtn = document.getElementById('emailBtn');
                emailBtn.onclick = async () => {
                    const email = prompt("Enter the recipient's email address:");
                    if (email) {
                        alert('PDF has been sent to email.');
                        const emailResponse = await fetch('/send-pdf-to-email', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                requestID,
                                category,
                                email,
                                pdfData: await blobToBase64(blob)
                            })
                        });
        
                        if (emailResponse.ok) {
                            alert('Email sent successfully');
                        } else {
                            alert('Failed to send email');
                        }
                    }
                };
            } else {
                console.error('Failed to generate PDF');
            }

}

function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}