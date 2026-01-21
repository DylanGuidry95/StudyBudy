import { useEffect, useState } from "react";
import "./AuthModals.css";
import { useAccounts } from "../../hooks/useAccounts";
import Cropper from "react-easy-crop";
import { getCroppedImage } from "../../utils/getCroppedImage";
import "../../css/cropper.css";

function ProfileUpdateForm({ stopViewProfile }) {
  const {
    profile,
    loading,
    error,
    avatarSignedUrl,
    updateName,
    updatePassword,
    updateAvatar,
  } = useAccounts();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [edit, setEdit] = useState(false);
  const [saving, setSaving] = useState(false);

  const [avatarPreview, setAvatarPreview] = useState(null);

  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  // --------------------------------------
  // SYNC DB PROFILE → FORM STATE
  // --------------------------------------
  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name ?? "");
      setLastName(profile.last_name ?? "");
    }
  }, [profile]);

  useEffect(() => {    
    if (avatarSignedUrl && !profileImage) {
      setAvatarPreview(avatarSignedUrl);
    }
  }, [avatarSignedUrl, profileImage]);

  // --------------------------------------
  // SUBMIT HANDLER
  // --------------------------------------
  const handleInformationUpdate = async (e) => {
    e.preventDefault();

    if (password && password !== confirmedPassword) return;

    try {
      setSaving(true);

      // Update name
      await updateName(firstName, lastName);

      // Update password only if provided
      if (password) {
        await updatePassword(password);
      }

      // Update avatar if selected
      if (profileImage) {
        await updateAvatar(profileImage);
      }

      // Reset sensitive fields
      setPassword("");
      setConfirmedPassword("");
      setProfileImage(null);
      setEdit(false);
      setProfileImage(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Avatar

  const onSelectImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const onCropComplete = (_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const handleCropSave = async () => {
    const croppedBlob = await getCroppedImage(imageSrc, croppedAreaPixels);

    const croppedFile = new File([croppedBlob], "avatar.jpg", {
      type: "image/jpeg",
    });

    // 🔹 Set preview immediately
    const previewUrl = URL.createObjectURL(croppedBlob);
    setAvatarPreview(previewUrl);

    setProfileImage(croppedFile);
    setShowCropper(false);
  };

  if (loading) return <p>Loading profile…</p>;

  return (
    <div className="signup-overlay">
      <div className="signup-modal">
        <div className="signup-header">
          <strong>Profile Details</strong>
        </div>

        <form onSubmit={handleInformationUpdate}>
          <div className="signup-content">
            <div className="avatar-preview-wrapper">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar Preview"
                  className="avatar-preview"
                />
              ) : (
                <div className="avatar-fallback">
                  {firstName?.[0]}
                  {lastName?.[0]}
                </div>
              )}
            </div>
            <div className="form-field">
              <label>First Name</label>
              <input
                value={firstName}
                placeholder="First Name"
                onChange={(e) => setFirstName(e.target.value)}
                disabled={!edit}
                required
              />
            </div>

            <div className="form-field">
              <label>Last Name</label>
              <input
                value={lastName}
                placeholder="Last Name"
                onChange={(e) => setLastName(e.target.value)}
                disabled={!edit}
                required
              />
            </div>

            {edit && (
              <>
                <div className="form-field">
                  <label>Password</label>
                  <input
                    type="password"
                    value={password}
                    placeholder="New Password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="form-field">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    value={confirmedPassword}
                    placeholder="Confirm Password"
                    onChange={(e) => setConfirmedPassword(e.target.value)}
                  />
                  {password && password !== confirmedPassword && (
                    <p style={{ color: "red" }}>Passwords do not match</p>
                  )}
                </div>

                <div className="form-field">
                  <label>Profile Picture</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onSelectImage}
                  />
                </div>

                <button type="submit" disabled={saving}>
                  {saving ? "Saving…" : "Save Changes"}
                </button>

                <br />

                <button type="button" onClick={() => setEdit(false)}>
                  Cancel
                </button>
              </>
            )}

            {!edit && (
              <button type="button" onClick={() => setEdit(true)}>
                Edit Information
              </button>
            )}

            <button type="button" onClick={stopViewProfile}>
              Close
            </button>

            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        </form>

        {showCropper && (
          <div className="cropper-overlay">
            <div className="cropper-wrapper">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className="cropper-actions">
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
              />

              <button type="button" onClick={handleCropSave}>
                Use Image
              </button>
              <button type="button" onClick={() => setShowCropper(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileUpdateForm;
