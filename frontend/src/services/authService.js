const delay = (ms = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function loginUser(email, password) {

  await delay();

  if (!email || !password) {
    throw new Error("Email and password required");
  }

  if (email === "admin@test.com" && password === "123456") {
    return {
      id: "1",
      name: "Admin",
      email: email,
      role: "admin",
    };
  }

  if (password === "123456") {
    return {
      id: "2",
      name: "Student",
      email: email,
      role: "student",
    };
  }

  throw new Error("Invalid credentials");

}