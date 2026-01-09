import { useState } from "react";
import { getCurrentSemester } from "../../utils/semester";
import SemesterSelect from "../form/SemesterSelect";
import YearInput from "../form/YearInput";

export function SubjectCreator({ addSubject }) {
  const [name, setName] = useState("");
  const [instructor, setInstructor] = useState("");
  const [semester, setSemester] = useState(getCurrentSemester());
  const [year, setYear] = useState(new Date().getFullYear());
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const submit = () => {
    if (!validate()) return;

    addSubject({ name, instructor, semester, year });

    setName("");
    setInstructor("");
    setSemester(getCurrentSemester());
    setYear(new Date().getFullYear());
  };

  const validate = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = true;
    if (!instructor.trim()) newErrors.instructor = true;
    if (!semester) newErrors.semester = true;
    if (!year) newErrors.year = true;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setSubmitError("Failed to create subject. Please fill out all required fields.");
      return false;
    }

    setSubmitError("");
    return true;
  };

  return (
    <div>
      <h3>Add New Subject</h3>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Subject Name"
      />

      <input
        value={instructor}
        onChange={(e) => setInstructor(e.target.value)}
        placeholder="Instructor"
      />

      <SemesterSelect value={semester} onChange={setSemester} />
      <YearInput value={year} onChange={setYear} />

      <button onClick={submit}>Add</button>

      {submitError && <p style={{ color: "red" }}>{submitError}</p>}
    </div>
  );
}

export default SubjectCreator;
