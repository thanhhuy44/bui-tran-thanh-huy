var sum_to_n_a = function (n) {
  let total = 0;
  for (let index = 1; index <= n; index++) {
    total += index;
  }
  return total;
};

var sum_to_n_b = function (n) {
  const isOdd = n % 2 !== 0;
  return (1 + n) * Math.floor(n / 2) + (!isOdd ? 0 : Math.ceil(n / 2));
};

var sum_to_n_c = function (n) {
  return Array.from(Array(n), (_, i) => i + 1).reduce(
    (prev, curr) => prev + curr,
    0
  );
};
