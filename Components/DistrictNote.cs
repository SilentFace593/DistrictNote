using Colossal.Serialization.Entities;
using Unity.Collections;
using Unity.Entities;

namespace DistrictNotesMod.Components
{
    public struct DistrictNoteData : IComponentData, ISerializable
    {
        public static readonly int kComponentVersion = 1;
        public FixedString4096Bytes Text;

        public void Serialize<TWriter>(TWriter writer) where TWriter : IWriter
        {
            writer.Write(kComponentVersion);
            writer.Write(Text.ToString());
        }

        public void Deserialize<TReader>(TReader reader) where TReader : IReader
        {
            reader.Read(out int version);
            reader.Read(out string text);
            Text = new FixedString4096Bytes(text);
        }
    }
}
