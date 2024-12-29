export default function exec(A) {
  let B = 0n;
  let C = 0n;
  const out = [];
  // loop = 3,0
  while (A !== 0n) {
    B = A % 8n ^ 2n; // 2,4,1,2
    C = A >> B; // 7,5
    B = B ^ C ^ 3n; // 4,1,1,3
    out.push(B % 8n); // 5,5
    // HINT:
    // A is shifted by 3 bits to the right (divided by 2^3 = 8)
    // on every iteration until A is 0
    A >>= 3n; // 0,3
  }
  return out;
}
