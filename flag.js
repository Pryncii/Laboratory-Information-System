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
        return "High";
    } else if (value < range[0]) {
        return "Low";
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
        return "High";
    } else if (value < range[0]) {
        return "Low";
    } else {
        return "Normal";
    }
}