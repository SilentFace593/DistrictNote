import { Component, useCallback, useEffect, useRef, useState } from "react";
import { bindValue, trigger, useValue } from "cs2/api";

const noteText$ = bindValue<string>("districtNotesMod", "noteText");
const noteVisible$ = bindValue<boolean>("districtNotesMod", "noteVisible");

// Error Boundary : intercepte les erreurs de rendu enfant
class SafeBoundary extends Component<{ children: any }, { crashed: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { crashed: false };
  }
  static getDerivedStateFromError() {
    return { crashed: true };
  }
  render() {
    if (this.state.crashed) return null;
    return this.props.children;
  }
}

const DistrictNoteSectionInner = ({ InfoSection }: { InfoSection: any }) => {
  const visible = useValue(noteVisible$);
  const savedText = useValue(noteText$);
  const [draft, setDraft] = useState<string>(
    typeof savedText === "string" ? savedText : ""
  );
  const timerRef = useRef<any>(null);

  // Quand l'entité sélectionnée change, on annule le timer en cours
  // et on resynchronise le brouillon avec le texte sauvegardé
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setDraft(typeof savedText === "string" ? savedText : "");
  }, [savedText]);

  const handleChange = useCallback((e: any) => {
    const newText = e.target.value;
    setDraft(newText);

    // Sauvegarde automatique 600ms après la dernière frappe
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      trigger("districtNotesMod", "setNoteText", newText);
      timerRef.current = null;
    }, 600);
  }, []);

    // Sauvegarde immédiate si le joueur quitte le champ
  const handleBlur = useCallback((e: any) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    trigger("districtNotesMod", "setNoteText", e.target.value);
  }, []);

  if (!visible || !InfoSection) return null;

  return (
    <InfoSection disableFoldout={true}>
      <div style={{ padding: "4px 0" }}>
        <div style={{
          color: "rgba(255,255,255,0.7)",
          fontSize: "12px",
          marginBottom: "4px",
          textTransform: "uppercase"
        }}>
          DistrictNote
        </div>
        <textarea
          value={draft}
          onChange={handleChange}
          onBlur={handleBlur}
          rows={5}
          placeholder="Écris ici l'histoire de ce district..."
          style={{
            width: "100%",
            resize: "vertical",
            background: "rgba(0,0,0,0.3)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "4px",
            padding: "6px",
            fontFamily: "inherit",
            fontSize: "13px",
            boxSizing: "border-box",
          }}
        />
      </div>
    </InfoSection>
  );
};

// Export : enveloppe tout dans le SafeBoundary
export const DistrictNoteSection = (InfoSection: any) => (props: any) => (
  <SafeBoundary>
    <DistrictNoteSectionInner InfoSection={InfoSection} />
  </SafeBoundary>
);