
let model = {
    displayValue: "0",
    inputMode: "replaceInput",
    pendingLowPrecedenceOperation: null,
    pendingLowPrecedenceValue: null,
    pendingHighPrecedenceOperation: null,
    pendingHighPrecedenceValue: null,
}

const buttons = document.getElementsByClassName("calc-button")

for (i = 0; i < buttons.length; i++) {
    let button = buttons[i];
    button.addEventListener("click", () => {
        handleButtonClick(button.classList, button.innerText);
    });
}

const handleButtonClick = (classList, value) => {
    if (classList.contains("disabled"))
        return;

    if (classList.contains("operator"))
        handleOperatorInput(value);

    if (classList.contains("numeric"))
        handleNumericInput(value);
}


const handleOperatorInput = (operator) => {
    if (operator === "=") {
        handleFullComputation();
    } else if (isHighPrecedence(operator)) {
        handleHighPrecedenceOperations();
        model.pendingHighPrecedenceValue = model.displayValue
        model.pendingHighPrecedenceOperation = operator
    } else {
        handleFullComputation();
        model.pendingLowPrecedenceValue = model.displayValue
        model.pendingLowPrecedenceOperation = operator
    }
    model.inputMode = "replaceInput"
}


const handleFullComputation = () => {
    let newVal = computeHighPrecedenceOperations() ?? Number(model.displayValue)
    if (model.pendingLowPrecedenceOperation === "+") {
        newVal = Number(model.pendingLowPrecedenceValue) + newVal
    }
    if (model.pendingLowPrecedenceOperation === "-") {
        newVal = Number(model.pendingLowPrecedenceValue) - newVal
    }
    nullifyPendingOperations();
    replaceDisplayValue(newVal)
}


const handleHighPrecedenceOperations = () => {
    if (!model.pendingHighPrecedenceOperation)
        return
    replaceDisplayValue(computeHighPrecedenceOperations())
}

const computeHighPrecedenceOperations = () => {
    if (model.pendingHighPrecedenceOperation === "*")
        return Number(model.pendingHighPrecedenceValue) * Number(model.displayValue);
    if (model.pendingHighPrecedenceOperation === "/") {
        if (model.displayValue === "0") {
            nullifyPendingOperations();
            return "Undefined"
        }
        return Number(model.pendingHighPrecedenceValue) / Number(model.displayValue);
    }
}

const isHighPrecedence = (op) => {
    return op === "*" || op === "/";
}

const handleNumericInput = (value) => {
    if (value === ".") {
        if (model.displayValue.indexOf(".") === -1) {
            appendToDisplayValue(value);
        }
    } else if (model.inputMode === "replaceInput") {
        replaceDisplayValue(value);
    } else {
        appendToDisplayValue(value);
    }
}


const displayModelValue = () => {
    document.getElementById("response-pane").innerText = model.displayValue;
}
const appendToDisplayValue = (value) => {
    model.displayValue = model.displayValue + value;
    displayModelValue();
}

const replaceDisplayValue = (value) => {
    model.displayValue = value;
    model.inputMode = "appendInput"
    displayModelValue();
}

const nullifyPendingOperations = () =>{
    model.pendingLowPrecedenceOperation = null
    model.pendingLowPrecedenceValue = null
    model.pendingHighPrecedenceValue = null;
    model.pendingHighPrecedenceOperation = null;
}



