console.log("Bruh")

/*
function process(event) {
    event.preventDefault();
    const phoneNumber = phoneInput.getNumber();
    info.style.display = "";
    info.innerHTML = `Phone number in E.164 format: <strong>${phoneNumber}</strong>`;
}
*/

function process(event) {
    event.preventDefault();
    const phoneNumber = phoneInput.getNumber();
    info.style.display = "none";
    error.style.display = "none";
    if (phoneInput.isValidNumber()) {
    info.style.display = "";
    info.innerHTML = `Phone number in E.164 format: <strong>${phoneNumber}</strong>`;
    } else {
    error.style.display = "";
    error.innerHTML = `Invalid phone number.`;
    }
}
