const { evaluate } = require("mathjs");

function evaluateFormula(formula, sheet) {
  try {
    let expression = formula.substring(1); // remove '='

    const cellRefs = expression.match(/[A-Z]+[0-9]+/g) || [];

    for (const ref of cellRefs) {
      const cell = sheet[ref];

      if (!cell) {
        return "#REF!";
      }

      if (typeof cell.value === "string" && cell.value.startsWith("#")) {
        return cell.value;
      }

      expression = expression.replaceAll(ref, cell.value);
    }

    const result = evaluate(expression);

    if (!isFinite(result)) {
      return "#DIV/0!";
    }

    return result;

  } catch (error) {
    return "#REF!";
  }
}

module.exports = {
  evaluateFormula
};