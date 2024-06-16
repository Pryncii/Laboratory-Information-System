function errorFn(err) {
    console.log("Error found. Please trace!");
    console.error(err);
}

function setDefault(value, defaultValue = "N/A") {
    return value || defaultValue;
}

function setDefaultNo(value, defaultValue = "-1") {
    return value || defaultValue;
}

function setDefaultDate(value, defaultValue = new Date(0)) {
    return value ? new Date(value) : defaultValue;
}

function isValidDate(dateString) {
    // Check if the string can be parsed into a valid date
    return !isNaN(Date.parse(dateString));
}

module.exports = {
    errorFn,
    setDefault,
    setDefaultNo,
    setDefaultDate,
    isValidDate
}