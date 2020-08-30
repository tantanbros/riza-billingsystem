function numberWithCommas(x) {
  return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function toCurrency(str) {
  return numberWithCommas(Number(str).toFixed(2));
}

export { numberWithCommas, toCurrency };
