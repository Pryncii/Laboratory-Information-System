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

        // console.log(formData);

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

function convertMinusOneToEmpty(obj) {
    for (let key in obj) {
        if (obj[key] === -1) {
            obj[key] = "";
        }
    }
}

function convertEmptyToMinusOne(obj, tests) {
    for (let i = 0; i < tests.length; i++) {
        if (obj[tests[i]] === "") {
            obj[tests[i]] = -1;
        }
    }
}

function generateTemplate(
    requestID,
    patientID,
    category,
    patientName,
    age,
    sex,
    alltests,
    results,
    allmedtechs
) {
    const data = JSON.parse(decodeURIComponent(results));
    convertMinusOneToEmpty(data);
    const medtechs = JSON.parse(decodeURIComponent(allmedtechs));
    convertMinusOneToEmpty(medtechs);

    test = alltests.includes(", ") ? alltests.split(", ") : [alltests];
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
            if (test[i].includes(" ")) {
                var name = test[i].replace(/ /g, "").toLowerCase();
            } else {
                var name = test[i].toLowerCase();
            }
            if (test[0] == "CBC" || test[0] == "CBC with Platelet Count") {
                if (i % 2 == 1) {
                    content += "<tr>";
                }
            } else {
                if (i % 2 == 0) {
                    content += "<tr>";
                }
            }
            if (test[i] == "CBC" || test[i] == "CBC with Platelet Count") {
                content += `
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-hemoglobin" name="hemoglobin" value="${data.hemoglobin}">
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
                            <input type="text" class="form-control text-center" id="${requestID}-hematocrit" name="hematocrit" value="${data.hematocrit}">
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
                            <input type="text" class="form-control text-center" id="${requestID}-rbc-count" name="rbc-count" value="${data.rbcCount}">
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
                            <input type="text" class="form-control text-center" id="${requestID}-wbc-count" name="wbc-count" value="${data.wbcCount}">
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
                            <input type="text" class="form-control text-center" id="${requestID}-neutrophil" name="neutrophil" value="${data.neutrophil}">
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
                            <input type="text" class="form-control text-center" id="${requestID}-lymphocyte" name="lymphocyte" value="${data.lymphocyte}">
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
                            <input type="text" class="form-control text-center" id="${requestID}-monocyte" name="monocyte" value="${data.monocyte}">
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
                            <input type="text" class="form-control text-center" id="${requestID}-eosinophil" name="eosinophil" value="${data.eosinophil}">
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
                            <input type="text" class="form-control text-center" id="${requestID}-basophil" name="basophil" value="${data.basophil}">
                            <label for="basophil">Basophil</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" id="${requestID}-basophil-flag" class="form-control form-control-sm" disabled>
                        </div>
                    </td>
                `;
                if (test[i] == "CBC") {
                    content += `
                    <td colspan=2>
                        <div class="form-floating m-2">
                            <select class="form-control text-center" id="${requestID}-plateletdesc" name="plateletdesc">
                                <option value="Inadequate">Inadequate</option>
                                <option value="Adequate">Adequate</option>
                            </select>
                            <label for="plateletdesc">Platelet</label>
                        </div>
                    </td>
                    `;
                } else {
                    content += `
                    <td>
                        <div class="form-floating m-2 id="${requestID}-platelet-lbl">
                            <input type="text" class="form-control text-center" id="${requestID}-platelet" name="platelet" value="${data.plateletCount}">
                            <label for="platelet">Platelet Count</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" id="${requestID}-platelet-flag" class="form-control form-control-sm" disabled>
                        </div>
                    </td>
                    `;
                }
                content += `
                </tr>
                `;
            } else {
                let tests = {
                    //HEMATOLOGY
                    esr: "esr",
                    bloodtypewithrh: "bloodWithRh",
                    clottingtime: "clottingTime",
                    bleedingtime: "bleedingTime",
                    //CHEMISTRY
                    fbs: "fbs",
                    creatinine: "creatinine",
                    uricacid: "uricAcid",
                    cholesterol: "cholesterol",
                    triglycerides: "triglycerides",
                    hdl: "hdl",
                    ldl: "ldl",
                    vldl: "vldl",
                    bun: "bun",
                    sgpt: "sgpt",
                    sgot: "sgot",
                    hba1c: "hba1c",
                };
                content += `
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-${name}" name="${name}" value="${data[tests[name]]
                    }"> 
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
            if (test[0] == "CBC" || test[0] == "CBC with Platelet Count") {
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
            <div class="item-label p-3 w-100 mx-2" id="${requestID}-clinical-microscopy">
                ${test}
            </div>
        `;
        if (test == "Urinalysis") {
            content = `
                <table class="w-100">
                    <tr>
                        <td>
                            <div class="form-floating m-2">
                                <input type="text" class="form-control text-center" id="${requestID}-urinalysis-color" name="color" value="${data.color}">
                                <label for="color">Color</label>
                            </div>
                        </td>
                        <td>
                            <div class="form-floating m-2">
                                <input type="text" class="form-control text-center" id="${requestID}-transparency" name="transparency" value="${data.transparency}">
                                <label for="transparency">Transparency</label>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="form-floating m-2">
                                <input type="text" class="form-control text-center" id="${requestID}-ph" name="ph" value="${data.pH}">
                                <label for="ph">pH</label>
                            </div>
                        </td>
                        <td>
                            <div class="form-floating m-2">
                                <input type="text" class="form-control text-center" id="${requestID}-specific-gravity" name="specific-gravity" value="${data.specificGravity}">
                                <label for="specific-gravity">Specific Gravity</label>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="form-floating m-2">
                                <input type="text" class="form-control text-center" id="${requestID}-sugar" name="sugar" value="${data.sugar}"> 
                                <label for="sugar">Sugar</label>
                            </div>
                        </td>
                        <td>
                            <div class="form-floating m-2">
                                <input type="text" class="form-control text-center" id="${requestID}-protein" name="protein" value="${data.protein}">
                                <label for="protein">Protein</label>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="form-floating m-2">
                                <input type="text" class="form-control text-center" id="${requestID}-pus" name="pus" value="${data.pus}">
                                <label for="pus">Pus</label>
                            </div>
                        </td>
                        <td>
                            <div class="form-floating m-2">
                                <input type="text" class="form-control text-center" id="${requestID}-rbc" name="rbc" value="${data.rbc}">
                                <label for="rbc">RBC</label>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="form-floating m-2">
                                <input type="text" class="form-control text-center" id="${requestID}-urinalysis-bacteria" name="bacteria" value="${data.bacteria}">
                                <label for="bacteria">Bacteria</label>
                            </div>
                        </td>
                        <td>
                            <div class="form-floating m-2" id="${requestID}-epithelial-cells-lbl">
                                <input type="text" class="form-control text-center" id="${requestID}-epithelial-cells" name="epithelial-cells" value="${data.epithelialCells}">
                                <label for="epithelial-cells">Epithelial Cells</label>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="form-floating m-2">
                                <input type="text" class="form-control text-center" id="${requestID}-mucus-thread" name="mucus-thread" value="${data.mucusThread}">
                                <label for="mucus-thread">Mucus Thread</label>
                            </div>
                        </td>
                    </tr>
                </table>
            `;
        } else if (test == "Fecalysis") {
            content = `
                <table class="w-100">
                    <tr>
                        <td>
                            <div class="form-floating m-2">
                                <input type="text" class="form-control text-center" id="${requestID}-fecalysis-color" name="color" value="${data.color}">
                                <label for="color">Color</label>
                            </div>
                        </td>
                        <td>
                            <div class="form-floating m-2">
                                <input type="text" class="form-control text-center" id="${requestID}-consistency" name="consistency" value="${data.consistency}"> 
                                <label for="consistency">Consistency</label>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="form-floating m-2">
                                <input type="text" class="form-control text-center" id="${requestID}-wbc" name="wbc" value="${data.wbc}">
                                <label for="wbc">WBC</label>
                            </div>
                        </td>
                        <td>
                            <div class="form-floating m-2">
                                <input type="text" class="form-control text-center" id="${requestID}-rbc" name="rbc" value="${data.rbc}">
                                <label for="rbc">RBC</label>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="form-floating m-2">
                                <input type="text" class="form-control text-center" id="${requestID}-ova-parasite" name="ova-parasite" value="${data.ovaParasite}">
                                <label for="ova-parasite">Ova/Parasite</label>
                            </div>
                        </td>
                        <td>
                            <div class="form-floating m-2">
                                <input type="text" class="form-control text-center" id="${requestID}-fat-globule" name="fat-globule" value="${data.fatGlobule}">
                                <label for="fat-globule">Fat Globule</label>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="form-floating m-2">
                                <input type="text" class="form-control text-center" id="${requestID}-bile-crystal" name="bile-crystal" value="${data.bileCrystal}">
                                <label for="bile-crystal">Bile Crystal</label>
                            </div>
                        </td>
                        <td>
                            <div class="form-floating m-2">
                                <input type="text" class="form-control text-center" id="${requestID}-vegetable-fiber" name="vegetable-fiber" value="${data.vegetableFiber}">
                                <label for="vegetable-fiber">Vegetable Fiber</label>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="form-floating m-2">
                                <input type="text" class="form-control text-center" id="${requestID}-meat-fiber" name="meat-fiber" value="${data.meatFiber}">
                                <label for="meat-fiber">Meat Fiber</label>
                            </div>
                        </td>
                        <td>
                            <div class="form-floating m-2" id="${requestID}-pus-cells-lbl">
                                <input type="text" class="form-control text-center" id="${requestID}-pus-cells" name="pus-cells" value="${data.pusCells}">
                                <label for="pus-cells">Pus Cells</label>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="form-floating m-2">
                                <input type="text" class="form-control text-center" id="${requestID}-erythrocyte" name="erythrocyte" value="${data.erythrocyte}">
                                <label for="erythrocyte">Erythrocyte</label>
                            </div>
                        </td>
                        <td>
                            <div class="form-floating m-2">
                                <input type="text" class="form-control text-center" id="${requestID}-yeast-cell" name="yeast-cell" value="${data.yeastCell}">
                                <label for="yeast-cell">Yeast Cell</label>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="form-floating m-2">
                                <input type="text" class="form-control text-center" id="${requestID}-fecalysis-bacteria" name="bacteria" value="${data.bacteria}">
                                <label for="bacteria">Bacteria</label>
                            </div>
                        </td>
                    </tr>
                </table>
            `;
        }
    } else if (category == "Serology") {
        let tests = {
            hbsag: "hbsAg",
            "rpr/vdrl": "rprVdrl",
            serumpregnancytest: "pregnancyTestSerum",
            urinepregnancytest: "pregnancyTestUrine",
            denguens1: "dengueNs1",
            dengueduo: "dengueDuo",
        };

        header = `
            <div class="item-label p-3 m-2 w-100">
                ${category}
            </div>
        `;
        content = `
            <table class="w-100">
        `;
        for (var i = 0; i < test.length; i++) {
            if (test[i].includes(" ")) {
                var name = test[i].replace(/ /g, "").toLowerCase();
            } else {
                var name = test[i].toLowerCase();
            }
            if (i % 2 == 0) {
                content += "<tr>";
            }
            if (
                test[i] == "Serum Pregnancy Test" ||
                test[i] == "Urine Pregnancy Test"
            ) {
                selectedPos = data[tests[name]] === "Positive" ? "selected" : "";
                selectedNeg = data[tests[name]] === "Negative" ? "selected" : "";
                content += `
                    <td>
                        <div class="form-floating m-2">
                            <select class="form-control text-center" id="${requestID}-${name}" name="${name}">
                                <option value="Positive" ${selectedPos}>Positive</option>
                                <option value="Negative" ${selectedNeg}>Negative</option>
                            </select>
                            <label for="${name}">${test[i]}</label>
                        </div>
                    </td>
                `;
            } else {
                content += `
                    <td>
                        <div class="form-floating m-2">
                            <input type="text" class="form-control text-center" id="${requestID}-${name}" name="${name}" value="${data[tests[name]]
                    }">
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
            <div class="form-floating mb-4">
                <select class="form-control text-center" id="${requestID}-medtech" name="medtech">`;
    for (var i = 0; i < medtechs.length; i++) {
        submit += `<option value="${medtechs[i].medtechID}">${medtechs[i].name}</option>`;
    }
    submit += `
                </select>
                <label for="medtech">Medtech</label>
            </div>
            <button type="button" class="btn btn-primary btn-lg mx-2" id="${requestID}-submit" onclick="saveChanges('${requestID}', '${category}')">Submit</button>
            <button type="button" class="btn btn-primary btn-lg mx-2" id="${requestID}-pdfsubmit" onclick="generatePDF('${requestID}', '${patientID}', '${category}', '${patientName}', '${age}', '${sex}')">Save to PDF</button>
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
    let pageNumber = $(`#pageDetails`).text().trim().split(" ")[1];
    let data = [];
    if (category === "Hematology") {
        let pltc = $(`#${requestID}-platelet-btn`).prop("checked")
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
            pltc: $("#" + requestID + "-platelet").val(),
            esr: $("#" + requestID + "-esr").val(),
            bwrh: $("#" + requestID + "-bloodtypewithrh").val(),
            clot: $("#" + requestID + "-clottingtime").val(),
            bleed: $("#" + requestID + "-bleedingtime").val(),
        });

        tests = [
            "hemo",
            "hema",
            "rbc",
            "wbc",
            "neut",
            "lymp",
            "mono",
            "eosi",
            "baso",
            "pltc",
            "esr",
            "bwrh",
            "clot",
            "bleed",
        ];
        convertEmptyToMinusOne(data[0], tests);
    } else if (category === "Clinical Microscopy") {
        //if ($(`#${requestID}-urinalysis-btn`).prop('checked')) {
        if ($(`#${requestID}-clinical-microscopy`).text().trim() == "Urinalysis") {
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

            tests = ["ph", "spgrav", "pus", "rbc"];
            convertEmptyToMinusOne(data[0], tests);
        }
        //else if ($(`#${requestID}-fecalysis-btn`).prop('checked')) {
        else if (
            $(`#${requestID}-clinical-microscopy`).text().trim() == "Fecalysis"
        ) {
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

            tests = ["rbc", "wbc", "pus", "yeast", "eryth"];
            convertEmptyToMinusOne(data[0], tests);
        }
    } else if (category === "Chemistry") {
        category = "Chemistry";
        data.push({
            fbs: $("#" + requestID + "-fbs").val(),
            crt: $("#" + requestID + "-creatinine").val(),
            uric: $("#" + requestID + "-uricacid").val(),
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

        tests = [
            "fbs",
            "crt",
            "uric",
            "chol",
            "tri",
            "hdl",
            "ldl",
            "vldl",
            "bun",
            "sgpt",
            "sgot",
            "hba1c",
        ];
        convertEmptyToMinusOne(data[0], tests);
    } else if (category === "Serology") {
        category = "Serology";
        data.push({
            hbsag: $("#" + requestID + "-hbsag").val(),
            rprvdrl: $("#" + requestID + "-rpr\\/vdrl").val(),
            pregs: $("#" + requestID + "-serumpregnancytest").val(),
            pregu: $("#" + requestID + "-urinepregnancytest").val(),
            dengN: $("#" + requestID + "-denguens1").val(),
            dengD: $("#" + requestID + "-dengueduo").val(),
        });
    }
    let currentPath = window.location.pathname;
    let endpoint = currentPath + "/save-edit-request";

    $("#Modal-" + requestID).modal("hide");

    $.post(
        endpoint,
        {
            requestID: requestID,
            category: category,
            data: data,
            pageNumber: pageNumber,
        },
        function (response, status) {
            if (status === "success" && response.redirect) {
                // Redirect to the new URL
                window.location.href = response.redirect;
            }
        }
    ); //fn+post
}

async function generatePDF(requestID, patientID, category, patientName, age, sex) {
    let data = [];

    if (category === "Hematology") {
        category = "hematology";
        let pltc = $(`#${requestID}-platelet-btn`).prop("checked")
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
            pltc: pltc,
        });
    } else if (category === "Clinical Microscopy") {
        category = "clinical-microscopy";
        if ($(`#${requestID}-clinical-microscopy`).text().trim() == "Urinalysis") {
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
                muc: $("#" + requestID + "-mucus-thread").val(),
            });
        } else if (
            $(`#${requestID}-clinical-microscopy`).text().trim() == "Fecalysis"
        ) {
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
                bac: $("#" + requestID + "-fecalysis-bacteria").val(),
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
            uric: $("#" + requestID + "-uricacid").val(),
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
        category = "serology";
        data.push({
            name: patientName,
            age: age,
            sex: sex,
            hbsag: $("#" + requestID + "-hbsag").val(),
            rprvdrl: $("#" + requestID + "-rpr\\/vdrl").val(),
            serum: $("#" + requestID + "-serumpregnancytest").val(),
            urine: $("#" + requestID + "-urinepregnancytest").val(),
            dengN: $("#" + requestID + "-denguens1").val(),
            dengD: $("#" + requestID + "-dengueduo").val(),
        });
    }

    const response = await fetch("/generate-pdf-" + category, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        // Display the PDF in the iframe
        const pdfFrame = document.getElementById("pdfFrame");
        pdfFrame.src = url;

        // Show the modal
        const modal = document.getElementById("pdfModal");
        modal.style.display = "block";

        document.querySelector(".close-pdf").onclick = function () {
            const modal = document.getElementById("pdfModal");
            modal.style.display = "none";
        };

        // Close the Email modal when the close button is clicked
        document.querySelector(".close-email").onclick = function () {
            emailModal.style.display = "none";
        };

        // Enable the download button
        const downloadBtn = document.getElementById("downloadBtn");
        downloadBtn.onclick = () => {
            const a = document.createElement("a");
            a.href = url;
            a.download = `Result_${requestID}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        };
        
        window.onclick = function (event) {
            const pdfModal = document.getElementById("pdfModal");
            const emailModal = document.getElementById("emailModal");
        
            // Close PDF modal if click outside of it
            if (event.target == pdfModal) {
                pdfModal.style.display = "none";
            }
        
            // Close Email modal if click outside of it
            if (event.target == emailModal) {
                emailModal.style.display = "none";
            }
        };

        document.getElementById("emailBtn").onclick = function (event) {
            event.preventDefault();
            event.stopPropagation();
        
            const emailModal = document.getElementById("emailModal");
            emailModal.style.display = "block";
        };

        emailReg.onclick = async () => {
            // alert("PDF has been sent to email.");
            const emailResponse = await fetch("/send-pdf-to-reg-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    requestID,
                    patientID,
                    category,
                    pdfData: await blobToBase64(blob),
                }),
            });

            // Log the status code and response text for debugging
            // console.log('Response Status:', emailResponse.status);
            const responseText = await emailResponse.text();
            // console.log('Response Text:', responseText);

            if (emailResponse.ok) {
                alert(`Success: ${responseText}`);
            } else {
                alert(`Failed to send email: ${responseText}`);
            }
        };

        emailInput.onclick = async () => {
            const email = prompt("Enter the recipient's email address:");
            if (email) {
                alert("PDF has been sent to email.");
                const emailResponse = await fetch("/send-pdf-to-email", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        requestID,
                        category,
                        email,
                        pdfData: await blobToBase64(blob),
                    }),
                });

                if (emailResponse.ok) {
                    alert("Email sent successfully");
                } else {
                    alert("Failed to send email");
                }
            }
        };

    } else {
        console.error("Failed to generate PDF");
    }
}

function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}
