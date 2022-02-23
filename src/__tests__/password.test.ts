import * as argon2 from "argon2";
test("Argon function", async () => {
  const hashedPassword = await argon2.hash("Password123@");
  expect(hashedPassword.length).toBeGreaterThan(10);
});
