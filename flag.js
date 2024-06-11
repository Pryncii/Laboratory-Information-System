function flag(parameter, value, gender) {
    let ranges = {
        "Hemoglobin": {
            "M": [140.0, 180.0],
            "F": [120.0, 160.0]
        },
        "Hematocrit": {
            "M": [0.40, 0.54],
            "F": [0.35, 0.48]
        },
        "RBC": {
            "M": [4.5, 6.0],
            "F": [4.0, 5.5]
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
        "WBC": [5.0, 10.0],
        "Neutrophil": [0.50, 0.75],
        "Lymphocyte": [0.25, 0.40],
        "Monocyte": [0.02, 0.06],
        "Eosinophil": [0.01, 0.04],
        "Basophil": [0, 0.01],
        "Platelet": [145, 450],
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

function flag3(parameter, value, sex){

    const ranges = {
        fbs: {
            M: [75.0, 115.0],
            F: [75.0, 115.0]
        },
        rbs: {
            M: [0, 140],
            F: [0, 140]
        },
        creatinine: {
            M: [0.7, 1.4],
            F: [0.6, 1.1]
        },
        uricAcid: {
            M: [2.5, 7.0],
            F: [2.5, 7.0]
        },
        cholesterol: {
            M: [0, 200],
            F: [0, 200]
        },
        triglycerides: {
            M: [0, 150],
            F: [0, 150]
        },
        hdl: {
            M: [30, 70],
            F: [30, 85]
        },
        ldl: {
            M: [0, 130],
            F: [0, 130]
        },
        vldl: {
            M: [8, 33],
            F: [8, 33]
        },
        bun: {
            M: [1.7, 8.3],
            F: [1.7, 8.3]
        },
        sgpt: {
            M: [0, 40],
            F: [0, 31]
        },
        sgot: {
            M: [0, 37],
            F: [0, 31]
        },
        hba1c: {
            M: [4.5, 6.5],
            F: [4.5, 6.5]
        }
    };
    
    let range = ranges[parameter][sex];
    if (value > range[1]) {
        return "HIGH";
    } else if (value < range[0]) {
        return "LOW";
    } else {
        return "Normal";
    }

    /*
    if (tests && tests.fbs != null) {
        if (tests.fbs < 75.0) {
            flagStatus = "LOW";
        } else if (tests.fbs > 115.0) {
            flagStatus = "HIGH";
        }
    }

    if (tests && tests.rbs != null) {
        if (tests.rbs > 140) {
            flagStatus = "HIGH";
        }
    }

    if (tests && tests.creatinine != null) {
        if (tests.creatinine < 0.7 && patients.sex === "M") {
            flagStatus = "LOW";
        } else if (tests.creatinine > 1.4 && patients.sex === "M") {
            flagStatus = "HIGH";
        } else if (tests.creatinine < 0.6 && patients.sex === "F") {
            flagStatus = "LOW";
        } else if (tests.creatinine > 1.1 && patients.sex === "F") {
            flagStatus = "HIGH";
        }
    }

    if (tests && tests.uricAcid != null) {
        if (tests.uricAcid < 2.5) {
            flagStatus = "LOW";
        } else if (tests.uricAcid > 7.0) {
            flagStatus = "HIGH";
        }
    }

    if (tests && tests.cholesterol != null) {
        if (tests.cholesterol > 200) {
            flagStatus = "HIGH";
        }
    }

    if (tests && tests.triglycerides != null) {
        if (tests.triglycerides > 150) {
            flagStatus = "HIGH";
        }
    }

    if (tests && tests.hdl != null) {
        if (tests.hdl < 30) {
            flagStatus = "LOW";
        } else if (tests.hdl > 70 && patients.sex === "M") {
            flagStatus = "LOW";
        } else if (tests.hdl > 85 && patients.sex === "F") {
            flagStatus = "HIGH";
        }
    }

    if (tests && tests.ldl != null) {
        if (tests.ldl > 130) {
            flagStatus = "HIGH";
        }
    }

    if (tests && tests.vldl != null) {
        if (tests.vldl < 8) {
            flagStatus = "LOW";
        } else if (tests.vldl > 33) {
            flagStatus = "HIGH";
        }
    }

    if (tests && tests.bun != null) {
        if (tests.bun < 1.7) {
            flagStatus = "LOW";
        } else if (tests.bun > 8.3) {
            flagStatus = "HIGH";
        }
    }

    if (tests && tests.sgpt != null) {
        if (tests.sgpt > 40 && patients.sex === "M") {
            flagStatus = "HIGH";
        } else if (tests.sgpt > 31 && patients.sex === "F") {
            flagStatus = "HIGH";
        }
    }

    if (tests && tests.sgot != null) {
        if (tests.sgot > 37 && patients.sex === "M") {
            flagStatus = "HIGH";
        } else if (tests.sgot > 31 && patients.sex === "F") {
            flagStatus = "HIGH";
        }
    }

    if (tests && tests.hba1c != null) {
        if (tests.hba1c < 4.5) {
            flagStatus = "LOW";
        } else if (tests.hba1c > 6.5) {
            flagStatus = "HIGH";
        }
    }
        */
}