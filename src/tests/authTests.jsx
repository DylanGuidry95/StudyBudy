import { useAuth } from "../auth/useAuth"

export function AuthTests({ }) {
    const auth = useAuth();

    if (auth.loading) return <p>Loading...</p>;

    if (!auth.user) {
        return (
            <>
                <button onClick={() => auth.signUp("guidry.dylan.95@gmail.com", "password123")}>
                    Sign Up
                </button>
                <button onClick={() => auth.signIn("guidry.dylan.95@gmail.com", "password123")}>
                    Sign In
                </button>
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

export default AuthTests