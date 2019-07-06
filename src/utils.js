function convertNumberToColumnName(n) {
  let columnName = '';
  let modulo;

  while (n > 0) {
    modulo = (n - 1) % 26;
    columnName = String.fromCharCode(65 + modulo).toString() + columnName;
    n = parseInt((n - modulo) / 26);
  }
  return columnName;
}

module.exports = {
  convertNumberToColumnName,
};
