import { useEffect, useState } from "react";
import { getCurrentSemesterKey } from "../utils/semester";

const SEMESTER_ORDER = {
  Spring: 1,
  Summer: 2,
  Fall: 3,
};

export function useSubjects(subjectsDb) {
  if (!subjectsDb) {
    throw new Error("useSubjects requires subjectsDb");
  }

  const {
    subjects = [],
    loading,
    addSubject,
    deleteSubject
  } = subjectsDb;

  const [openGroups, setOpenGroups] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const currentSemesterKey = getCurrentSemesterKey();

  const matchSearch = (s) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.instructor.toLowerCase().includes(q)
    );
  };

  const groupedSubjects = subjects.reduce((groups, s) => {
    if (!matchSearch(s)) return groups;
    const key = `${s.semester} ${s.year}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(s);
    return groups;
  }, {});

  const sortedGroups = Object.keys(groupedSubjects).sort((a, b) => {
    if (a === currentSemesterKey) return -1;
    if (b === currentSemesterKey) return 1;

    const [sa, ya] = a.split(" ");
    const [sb, yb] = b.split(" ");

    if (ya !== yb) return yb - ya;
    return SEMESTER_ORDER[sb] - SEMESTER_ORDER[sa];
  });

  const toggleGroup = (group) => {
    setOpenGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  useEffect(() => {
    setOpenGroups((prev) => {
      const next = { ...prev };
      sortedGroups.forEach((g) => {
        if (next[g] === undefined) next[g] = true;
      });
      return next;
    });
  }, [sortedGroups]);

  return {
    loading,
    subjects,
    addSubject,
    deleteSubject,
    groupedSubjects,
    sortedGroups,
    openGroups,
    toggleGroup,
    searchTerm,
    setSearchTerm,
  };
}
