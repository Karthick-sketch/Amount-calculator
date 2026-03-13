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

function calculateDuration() {
  const startInput = document.getElementById("start-date").value;
  const endInput = document.getElementById("end-date").value;

  if (!startInput || !endInput) {
    document.getElementById("duration-result1").innerHTML =
      "0 years, 0 months, and 0 days";
    document.getElementById("duration-result2").innerHTML =
      "0 months and 0 days";
    document.getElementById("duration-result3").innerHTML = "0 days";
    return;
  }

  let start = new Date(startInput);
  let end = new Date(endInput);

  if (start > end) [start, end] = [end, start];

  // subscription logic: add 1 day to end
  end.setDate(end.getDate() + 1);

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months--;
    const prevMonthDays = new Date(
      end.getFullYear(),
      end.getMonth(),
      0,
    ).getDate();
    days += prevMonthDays;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const totalMonths = years * 12 + months;
  const totalDays = Math.floor((end - start) / (1000 * 60 * 60 * 24));

  document.getElementById("duration-result1").innerHTML =
    `${years} years, ${months} months, and ${days} days`;

  document.getElementById("duration-result2").innerHTML =
    `${totalMonths} months and ${days} days`;

  document.getElementById("duration-result3").innerHTML = `${totalDays} days`;
}

function calculatePriorDate() {
  const end = new Date(document.getElementById("end-date-prior").value);
  const days = parseInt(document.getElementById("renewal-notice").value);
  if (!end.getTime() || isNaN(days)) {
    return;
  }
  const prior = new Date(end);
  prior.setDate(end.getDate() - days);
  const formatted = prior.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  document.getElementById("prior-date-result").innerHTML = formatted;
}
