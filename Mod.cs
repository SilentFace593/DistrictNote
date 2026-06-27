using Colossal.Logging;
using DistrictNotesMod.Systems;
using Game;
using Game.Modding;
namespace DistrictNotesMod
{
    public class Mod : IMod
    {
        public static readonly ILog log = LogManager.GetLogger(nameof(DistrictNotesMod))
            .SetShowsErrorsInUI(false);

        public void OnLoad(UpdateSystem updateSystem)
        {
            log.Info("DistrictNotesMod : chargement.");

            // Le système doit tourner pendant la phase UIUpdate, comme tous
            // les systèmes qui exposent des bindings à l'interface.
            updateSystem.UpdateAt<DistrictNoteUISystem>(SystemUpdatePhase.UIUpdate);
        }

        public void OnDispose()
        {
            log.Info("DistrictNotesMod : déchargement.");
        }
    }
}
