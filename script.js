document.addEventListener("DOMContentLoaded", function () {
  const themeToggle = document.getElementById("themeToggle");
  const body = document.getElementById("body");
  const themeIcon = themeToggle.querySelector("i");

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    body.classList.add("dark");
    themeIcon.classList.remove("ri-sun-line");
    themeIcon.classList.add("ri-moon-line");
  }

  themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark");

    if (body.classList.contains("dark")) {
      localStorage.setItem("theme", "dark");
      themeIcon.classList.remove("ri-sun-line");
      themeIcon.classList.add("ri-moon-line");
    } else {
      localStorage.setItem("theme", "light");
      themeIcon.classList.remove("ri-moon-line");
      themeIcon.classList.add("ri-sun-line");
    }
  });
  const calculatorModeButtons = document.querySelectorAll(
    ".calculator-mode-btn"
  );
  const scientificKeypad = document.querySelector(".scientific-keypad");
  const basicKeypad = document.querySelector(".basic-keypad");
  let isScientificMode = false;
  calculatorModeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const mode = button.getAttribute("data-mode");
      calculatorModeButtons.forEach((btn) => {
        btn.classList.remove(
          "bg-white",
          "shadow-sm",
          "text-gray-800",
          "active"
        );
        btn.classList.add("text-gray-600");
      });
      button.classList.add("bg-white", "shadow-sm", "text-gray-800", "active");
      button.classList.remove("text-gray-600");
      if (mode === "scientific") {
        scientificKeypad.classList.remove("hidden");
        isScientificMode = true;
      } else {
        scientificKeypad.classList.add("hidden");
        isScientificMode = false;
      }
    });
  });
  function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0) return 1;
    let result = 1;
    for (let i = 1; i <= n; i++) result *= i;
    return result;
  }
  document.querySelectorAll("[data-scientific]").forEach((button) => {
    button.addEventListener("click", () => {
      const operation = button.getAttribute("data-scientific");
      const currentNumber = parseFloat(currentInput);
      switch (operation) {
        case "sin":
          currentInput = Math.sin(currentNumber).toString();
          break;
        case "cos":
          currentInput = Math.cos(currentNumber).toString();
          break;
        case "tan":
          currentInput = Math.tan(currentNumber).toString();
          break;
        case "log":
          currentInput = Math.log10(currentNumber).toString();
          break;
        case "ln":
          currentInput = Math.log(currentNumber).toString();
          break;
        case "pi":
          currentInput = Math.PI.toString();
          break;
        case "e":
          currentInput = Math.E.toString();
          break;
        case "pow":
          previousInput = currentInput;
          operation = "pow";
          shouldResetInput = true;
          break;
        case "sqrt":
          currentInput = Math.sqrt(currentNumber).toString();
          break;
        case "fact":
          currentInput = factorial(currentNumber).toString();
          break;
      }
      updateDisplay();
    });
  });
  const previousCalculationElement = document.getElementById(
    "previous-calculation"
  );
  const currentCalculationElement = document.getElementById(
    "current-calculation"
  );
  let currentInput = "0";
  let previousInput = "";
  let operation = null;
  let shouldResetInput = false;
  function updateDisplay() {
    currentCalculationElement.textContent = currentInput;
    previousCalculationElement.textContent = previousInput;
  }
  function appendNumber(number) {
    if (currentInput === "0" && number !== ".") {
      currentInput = number;
    } else if (shouldResetInput) {
      currentInput = number;
      shouldResetInput = false;
    } else {
      if (number === "." && currentInput.includes(".")) return;
      currentInput += number;
    }
  }
  function handleOperation(op) {
    if (operation !== null) calculate();
    operation = op;
    previousInput = currentInput + " " + getOperationSymbol(op);
    shouldResetInput = true;
  }
  function calculate() {
    if (operation === null || shouldResetInput) return;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    let result;
    switch (operation) {
      case "+":
        result = prev + current;
        break;
      case "-":
        result = prev - current;
        break;
      case "*":
        result = prev * current;
        break;
      case "/":
        result = prev / current;
        break;
      default:
        return;
    }
    currentInput = result.toString();
    operation = null;
    previousInput = "";
  }
  function getOperationSymbol(op) {
    switch (op) {
      case "+":
        return "+";
      case "-":
        return "−";
      case "*":
        return "×";
      case "/":
        return "÷";
      default:
        return "";
    }
  }
  function clear() {
    currentInput = "0";
    previousInput = "";
    operation = null;
    shouldResetInput = false;
  }
  function deleteLastDigit() {
    if (currentInput.length === 1) {
      currentInput = "0";
    } else {
      currentInput = currentInput.slice(0, -1);
    }
  }
  function handlePercentage() {
    currentInput = (parseFloat(currentInput) / 100).toString();
  }
  function toggleSign() {
    currentInput = (parseFloat(currentInput) * -1).toString();
  }

  document.querySelectorAll("[data-number]").forEach((button) => {
    button.addEventListener("click", () => {
      appendNumber(button.getAttribute("data-number"));
      updateDisplay();
    });
  });

  document.querySelectorAll("[data-operation]").forEach((button) => {
    button.addEventListener("click", () => {
      if (operation === null) {
        previousInput = currentInput;
      }
      handleOperation(button.getAttribute("data-operation"));
      updateDisplay();
    });
  });

  document
    .querySelector('[data-action="clear"]')
    .addEventListener("click", () => {
      clear();
      updateDisplay();
    });
  document
    .querySelector('[data-action="delete"]')
    .addEventListener("click", () => {
      deleteLastDigit();
      updateDisplay();
    });
  document
    .querySelector('[data-action="percent"]')
    .addEventListener("click", () => {
      handlePercentage();
      updateDisplay();
    });
  document
    .querySelector('[data-action="plusMinus"]')
    .addEventListener("click", () => {
      toggleSign();
      updateDisplay();
    });
  document
    .querySelector('[data-action="calculate"]')
    .addEventListener("click", () => {
      if (operation) {
        previousInput += " " + currentInput + " =";
        calculate();
        shouldResetInput = true;
        updateDisplay();
      }
    });

  document.addEventListener("keydown", (event) => {
    if (/^\d$/.test(event.key)) {
      appendNumber(event.key);
      updateDisplay();
    } else if (event.key === ".") {
      appendNumber(".");
      updateDisplay();
    } else if (
      event.key === "+" ||
      event.key === "-" ||
      event.key === "*" ||
      event.key === "/"
    ) {
      if (operation === null) {
        previousInput = currentInput;
      }
      handleOperation(event.key);
      updateDisplay();
    } else if (event.key === "Enter" || event.key === "=") {
      if (operation) {
        previousInput += " " + currentInput + " =";
        calculate();
        shouldResetInput = true;
        updateDisplay();
      }
    } else if (event.key === "Backspace") {
      deleteLastDigit();
      updateDisplay();
    } else if (event.key === "Escape") {
      clear();
      updateDisplay();
    } else if (event.key === "%") {
      handlePercentage();
      updateDisplay();
    }
  });
  updateDisplay();
});
