using DistrictNotesMod.Components;
using Game.Tools;
using Game.UI;
using Unity.Entities;
using Colossal.UI.Binding;
using System.Text;
using Unity.Collections;

namespace DistrictNotesMod.Systems
{
    //kMaxTextLength => paramètre arbitraire du nombre de caractères saisissable
    public partial class DistrictNoteUISystem : UISystemBase
    {
        private const string kGroup = "districtNotesMod";
        private const int kMaxTextLength = 3800;

        private ToolSystem m_ToolSystem;
        private EntityManager m_EntityManager;
        private Entity m_LastLoggedEntity = Entity.Null;

        protected override void OnCreate()
        {
            base.OnCreate();

            m_ToolSystem = World.GetOrCreateSystemManaged<ToolSystem>();
            m_EntityManager = World.EntityManager;

            AddUpdateBinding(new GetterValueBinding<bool>(
                kGroup, "noteVisible", HasSelectedDistrict));

            AddUpdateBinding(new GetterValueBinding<string>(
                kGroup, "noteText", GetCurrentNoteText));

            AddBinding(new TriggerBinding<string>(
                kGroup, "setNoteText", SetCurrentNoteText));
        }

        //Game.Areas.District est le nom du composant qui gère les District
        private bool HasSelectedDistrict()
        {
            Entity selected = m_ToolSystem.selected;
            return selected != Entity.Null
                && m_EntityManager.Exists(selected)
                && m_EntityManager.HasComponent<Game.Areas.District>(selected);
        }

        private string GetCurrentNoteText()
        {
            Entity selected = m_ToolSystem.selected;

            if (selected == Entity.Null || !m_EntityManager.Exists(selected))
                return string.Empty;

            if (m_EntityManager.HasComponent<DistrictNoteData>(selected))
                return m_EntityManager.GetComponentData<DistrictNoteData>(selected).Text.ToString();

            return string.Empty;
        }

        private void SetCurrentNoteText(string newText)
        {
            Entity selected = m_ToolSystem.selected;

            if (selected == Entity.Null || !m_EntityManager.Exists(selected))
                return;

            if (newText != null && newText.Length > kMaxTextLength)
                newText = newText.Substring(0, kMaxTextLength);

            var note = new DistrictNoteData { Text = newText ?? string.Empty };

            if (m_EntityManager.HasComponent<DistrictNoteData>(selected))
                m_EntityManager.SetComponentData(selected, note);
            else
                m_EntityManager.AddComponentData(selected, note);
        }
    }
}