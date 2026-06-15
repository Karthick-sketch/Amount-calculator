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
    if (answer === null || answer === undefined) throw "invalid";
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

/**
 * Parses a date from free text. Supports:
 *   YYYY-MM-DD / YYYY/MM/DD        → "2026-06-15", "2026/06/15"
 *   DD-MM-YYYY / DD/MM/YYYY        → "15-06-2026", "15/06/2026"
 *   DD MMM YYYY / MMM DD YYYY      → "15 Jun 2026", "Jun 15 2026"
 *   Month DD, YYYY                 → "June 15, 2026"
 * Returns a Date (local midnight) or null if unparseable.
 */
function parseDate(text) {
  if (!text || !text.trim()) return null;
  const raw = text.trim();

  const MONTHS = {
    jan: 0,
    feb: 1,
    mar: 2,
    apr: 3,
    may: 4,
    jun: 5,
    jul: 6,
    aug: 7,
    sep: 8,
    oct: 9,
    nov: 10,
    dec: 11,
  };

  // 1. YYYY-MM-DD or YYYY/MM/DD
  let m = raw.match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})$/);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3]);

  // 2. DD-MM-YYYY or DD/MM/YYYY
  m = raw.match(/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/);
  if (m) return new Date(+m[3], +m[2] - 1, +m[1]);

  // 3. DD MMM YYYY  (e.g. "15 Jun 2026")
  m = raw.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  if (m) {
    const mon = MONTHS[m[2].slice(0, 3).toLowerCase()];
    if (mon !== undefined) return new Date(+m[3], mon, +m[1]);
  }

  // 4. MMM DD YYYY or MMM DD, YYYY  (e.g. "Jun 15 2026", "June 15, 2026")
  m = raw.match(/^([A-Za-z]+)\s+(\d{1,2})[,\s]+(\d{4})$/);
  if (m) {
    const mon = MONTHS[m[1].slice(0, 3).toLowerCase()];
    if (mon !== undefined) return new Date(+m[3], mon, +m[2]);
  }

  return null;
}

/** Sets a red border on an input if text was entered but couldn't be parsed. */
function markValidity(el, text, date) {
  el.style.outline = text && !date ? "2px solid #e74c3c" : "";
}

function calculateDuration() {
  const startEl = document.getElementById("start-date");
  const endEl = document.getElementById("end-date");

  let start = parseDate(startEl.value);
  let end = parseDate(endEl.value);

  markValidity(startEl, startEl.value, start);
  markValidity(endEl, endEl.value, end);

  if (!start || !end) {
    document.getElementById("duration-result1").innerHTML =
      "0 years, 0 months, and 0 days";
    document.getElementById("duration-result2").innerHTML =
      "0 months and 0 days";
    document.getElementById("duration-result3").innerHTML = "0 days";
    return;
  }

  if (start > end) [start, end] = [end, start];

  // subscription logic: add 1 day to end
  end.setDate(end.getDate() + 1);

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months--;
    days += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
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
  const endEl = document.getElementById("end-date-prior");
  const days = parseInt(document.getElementById("renewal-notice").value);
  const end = parseDate(endEl.value);

  markValidity(endEl, endEl.value, end);

  if (!end || isNaN(days)) return;

  const prior = new Date(end);
  prior.setDate(end.getDate() - days);

  document.getElementById("prior-date-result").innerHTML =
    prior.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
}
