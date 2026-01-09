import { useState } from "react";
import { useAuth } from "./useAuth";

export function AuthControls({}) {
  const auth = useAuth();
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    const { error } = await signIn(email, password);
    if (error) setError(error.message);
  };

  const handleSignup = async () => {
    const { error } = await signUp(email, password);
    if (error) setError(error.message);
  };

  if (auth.loading) return <p>Loading...</p>;

  if (!auth.user) {
    return (
      <>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button onClick={handleSignup}>Sign Up</button>
        <button onClick={handleLogin}>Sign In</button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </>
    );
  }

  return (
    <>
      <p>Logged in as {auth.user.email}</p>
      <button onClick={auth.signOut}>Log out</button>
    </>
  );
}

export default AuthControls;
