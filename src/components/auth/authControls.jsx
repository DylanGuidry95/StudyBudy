import { useAuthContext } from "../auth/AuthProvider";
import { useState } from "react";
import ProfileUpdateForm from "./ProfileUpdateForm";
import LoginForm from "./LoginForm"

function AuthControls() {
  const auth = useAuthContext();
  const [profileView, setProfileView] = useState(false);

  const firstName = auth.profile?.first_name;
  const lastName = auth.profile?.last_name;

  if(!auth.user && !auth.authLoading) {
    return <LoginForm/>
  }

  return (
    <div className="auth-controls">      
      <div className="auth-user-info">
        {auth.avatarSignedUrl ? (
          <img
            src={auth.avatarSignedUrl}
            alt="Avatar"
            className="auth-avatar"
          />
        ) : (
          <div className="auth-avatar-fallback">
            {firstName?.[0]}
            {lastName?.[0]}
          </div>
        )}

        <div className="auth-text">
          <p>
            Logged in as{" "}
            <strong>
              {firstName && lastName
                ? `${firstName} ${lastName}`
                : auth.user.email}
            </strong>
          </p>
        </div>
      </div>

      <button onClick={auth.signOut}>Log out</button>
      <button onClick={() => setProfileView(true)}>Edit Account</button>

      {profileView && (
        <ProfileUpdateForm stopViewProfile={() => setProfileView(false)} />
      )}
    </div>
  );
}

export default AuthControls;
