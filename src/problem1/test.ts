var sum_to_n_a = function (n: number): number {
  const array = Array.from(Array(n).keys()).map((item) => item + 1);
  return array.reduce((sum, num) => sum + num, 0);
};

var sum_to_n_b = function (n: number): number {
  return ((1 + n) * n) / 2;
};

var sum_to_n_c = function (n: number): number {
  if (n <= 0) return 0;
  return n + sum_to_n_c(n - 1);
};
