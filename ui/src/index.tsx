import { ModRegistrar } from "cs2/modding";
import { createElement } from "react";
import { DistrictNoteSection } from "./components/DistrictNotePanel";

const register: ModRegistrar = (moduleRegistry) => {

  const InfoSection = moduleRegistry.registry.get(
    "game-ui/game/components/selected-info-panel/shared-components/info-section/info-section.tsx"
  )?.["InfoSection"];

  //Game.UI.InGame.PoliciesSection correspond au panneau Politique dans le panneau Districit, dans lequel est enveloppé DistrictNote
  moduleRegistry.extend(
    "game-ui/game/components/selected-info-panel/selected-info-sections/selected-info-sections.tsx",
    "selectedInfoSectionComponents",
    (original: any) => {
      const originalPoliciesSection = original["Game.UI.InGame.PoliciesSection"];

      const WrappedPoliciesSection = (props: any) => {
        return createElement(
          "div",
          null,
          originalPoliciesSection ? createElement(originalPoliciesSection, props) : null,
          createElement(DistrictNoteSection(InfoSection), props)
        );
      };

      return {
        ...original,
        "Game.UI.InGame.PoliciesSection": WrappedPoliciesSection,
      };
    }
  );
};

export default register;