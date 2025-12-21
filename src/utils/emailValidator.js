export function isCollegeEmailValid(email) {
  const collegeDomain = "@mitvpu.ac.in";
  return email.endsWith(collegeDomain);
}
