import { useState } from "react";
import { formatDateTime } from "../components/form/helpers";

export function useGuides(subject, updateSubject) {
  const [activeGuideId, setActiveGuideId] = useState(null);

  const activeGuide = subject.guides.find(
    (g) => g.id === activeGuideId
  );

  const addGuide = (title) => {
    if (!title) return;

    updateSubject({
      ...subject,
      guides: [
        ...subject.guides,
        {
          id: Date.now(),
          title,
          lastEdited: Date.now(),
          notes: [],
          attachments: [],
        },
      ],
    });
  };

  const deleteGuide = (id) => {
    if (!window.confirm("Delete this study guide?")) return;

    updateSubject({
      ...subject,
      guides: subject.guides.filter((g) => g.id !== id),
    });

    if (id === activeGuideId) {
      setActiveGuideId(null);
    }
  };

  const updateActiveGuide = (updates) => {
    updateSubject({
      ...subject,
      guides: subject.guides.map((g) =>
        g.id === activeGuideId
          ? {
              ...g,
              ...updates,
              lastEdited: Date.now(),
            }
          : g
      ),
    });
  };

  return {
    activeGuide,
    activeGuideId,    
    setActiveGuideId,
    addGuide,
    deleteGuide,
    updateActiveGuide,
  };
}
