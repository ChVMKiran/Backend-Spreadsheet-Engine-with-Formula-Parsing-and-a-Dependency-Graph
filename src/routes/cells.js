const express = require("express");
const router = express.Router();

const {
  setCell,
  getCell,
  getSheet,
  addDependency,
  getDependents
} = require("../services/sheetService");

const { evaluateFormula } = require("../services/evaluator");

/**
 * extract references
 */
function extractRefs(formula) {
  return formula.match(/[A-Z]+[0-9]+/g) || [];
}

/**
 * detect cycle using DFS
 */
function detectCycle(sheet, startCell, refs, visited = new Set()) {
  for (const ref of refs) {
    if (ref === startCell) {
      return true;
    }

    const cell = sheet[ref];

    if (cell && typeof cell.formula === "string") {
      const nextRefs = extractRefs(cell.formula);

      for (const r of nextRefs) {
        if (r === startCell) {
          return true;
        }

        if (!visited.has(r)) {
          visited.add(r);
          if (detectCycle(sheet, startCell, [r], visited)) {
            return true;
          }
        }
      }
    }
  }

  return false;
}

/**
 * recompute dependents
 */
function recompute(sheetId, cellId) {
  const sheet = getSheet(sheetId);
  const deps = getDependents(sheetId, cellId);

  for (const dep of deps) {
    const cell = sheet[dep];

    if (cell && typeof cell.formula === "string" && cell.formula.startsWith("=")) {
      const newValue = evaluateFormula(cell.formula, sheet);
      cell.value = newValue;

      recompute(sheetId, dep);
    }
  }
}

/**
 * Set Cell
 */
router.put("/api/sheets/:sheetId/cells/:cellId", (req, res) => {
  const { sheetId, cellId } = req.params;
  const { value } = req.body;

  const sheet = getSheet(sheetId);

  let computedValue = value;

  if (typeof value === "string" && value.startsWith("=")) {
    const refs = extractRefs(value);

    if (detectCycle(sheet, cellId, refs)) {
      setCell(sheetId, cellId, {
        value: "#CYCLE!",
        formula: value
      });

      return res.status(200).json({
        value: "#CYCLE!"
      });
    }

    for (const ref of refs) {
      addDependency(sheetId, ref, cellId);
    }

    computedValue = evaluateFormula(value, sheet);
  }

  setCell(sheetId, cellId, {
    value: computedValue,
    formula: value
  });

  recompute(sheetId, cellId);

  res.status(200).json({
    value: computedValue
  });
});

/**
 * Get Cell
 */
router.get("/api/sheets/:sheetId/cells/:cellId", (req, res) => {
  const { sheetId, cellId } = req.params;

  const cell = getCell(sheetId, cellId);

  if (!cell) {
    return res.status(404).json({
      error: "Cell not found"
    });
  }

  res.status(200).json({
    value: cell.value
  });
});

module.exports = router;