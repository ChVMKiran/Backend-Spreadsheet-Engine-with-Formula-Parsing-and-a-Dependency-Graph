const sheets = {};
const dependents = {};

function getSheet(sheetId) {
  if (!sheets[sheetId]) {
    sheets[sheetId] = {};
    dependents[sheetId] = {};
  }
  return sheets[sheetId];
}

function setCell(sheetId, cellId, cellData) {
  const sheet = getSheet(sheetId);
  sheet[cellId] = cellData;
}

function getCell(sheetId, cellId) {
  const sheet = sheets[sheetId];
  if (!sheet || !sheet[cellId]) {
    return null;
  }
  return sheet[cellId];
}

function addDependency(sheetId, dependency, cellId) {
  if (!dependents[sheetId][dependency]) {
    dependents[sheetId][dependency] = new Set();
  }

  dependents[sheetId][dependency].add(cellId);
}

function getDependents(sheetId, cellId) {
  if (!dependents[sheetId] || !dependents[sheetId][cellId]) {
    return [];
  }

  return Array.from(dependents[sheetId][cellId]);
}

module.exports = {
  getSheet,
  setCell,
  getCell,
  addDependency,
  getDependents
};