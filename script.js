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
 *   MM/DD/YYYY or MM-DD-YYYY       → "7/24/2026", "07-24-2026"
 *   DD/MM/YYYY                     → "24/07/2026" (only when day part > 12, unambiguous)
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

  // 1. YYYY-MM-DD or YYYY/MM/DD  (4-digit year first — unambiguous)
  let m = raw.match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})$/);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3]);

  // 2. Two numbers + 4-digit year: MM/DD/YYYY vs DD/MM/YYYY
  //    - If the first number > 12 it can only be a day → DD/MM/YYYY
  //    - Otherwise (second > 12 or both ≤ 12) → default MM/DD/YYYY (US convention)
  m = raw.match(/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/);
  if (m) {
    const a = +m[1],
      b = +m[2],
      yr = +m[3];
    if (a > 12) {
      return new Date(yr, b - 1, a); // DD/MM/YYYY
    } else {
      return new Date(yr, a - 1, b); // MM/DD/YYYY
    }
  }

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

/** Sets a red outline on an input if text was entered but couldn't be parsed. */
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

  const reset = () => {
    document.getElementById("duration-years").textContent = "0";
    document.getElementById("duration-months").textContent = "0";
    document.getElementById("duration-weeks").textContent = "0";
    document.getElementById("duration-days").textContent = "0";
  };

  if (!start || !end) {
    reset();
    return;
  }

  if (start > end) [start, end] = [end, start];

  // subscription logic: add 1 day to end
  end.setDate(end.getDate() + 1);

  const totalDays = Math.floor((end - start) / (1000 * 60 * 60 * 24));

  // Years: full calendar years elapsed
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  if (months < 0) {
    years--;
    months += 12;
  }

  // Total whole months
  const totalMonths = years * 12 + months;

  // Total whole weeks
  const totalWeeks = Math.floor(totalDays / 7);

  document.getElementById("duration-years").textContent = years + " Years";
  document.getElementById("duration-months").textContent =
    totalMonths + " Months";
  document.getElementById("duration-weeks").textContent = totalWeeks + " Weeks";
  document.getElementById("duration-days").textContent = totalDays + " Days";
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
