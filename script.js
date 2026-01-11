const symbols = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  ".",
  "+",
  "-",
  "*",
  "/",
  "(",
  ")",
];

function calculateAmount(event) {
  const values = event.target.value.split(" ").map((value) => {
    let numText = "";
    for (let v of value) {
      if ((v >= "0" && v <= "9") || v === ".") {
        numText += v;
      }
    }
    return Number(numText);
  });
  document.getElementById("amount-result").innerHTML = values
    .reduce((a, b) => a + b, 0)
    .toFixed(2);
}

function calculateExpression(event) {
  const result = document.getElementById("expression-result");
  let expression = "";
  for (let v of event.target.value) {
    if (symbols.includes(v)) {
      expression += v;
    }
  }
  try {
    const answer = eval(expression);
    if (answer === null || answer === undefined) {
      throw "invalid";
    }
    result.innerHTML = answer.toFixed(2);
  } catch (e) {
    result.innerHTML = "0.00";
  }
}

function capitalize(event) {
  let text = event.target.value.toLowerCase();
  text = text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  document.getElementById("capitalize-result").innerText = text;
}
