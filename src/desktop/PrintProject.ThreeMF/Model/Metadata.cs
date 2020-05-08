namespace PrintProject.ThreeMF.Model
{
    public sealed class Metadata
    {
        public Metadata(CMetaData metaData)
        {
            Key = metaData.GetKey();
            Type = metaData.GetType();
            Name = metaData.GetName();
            Value = metaData.GetValue();
            MustPreserve = metaData.GetMustPreserve();
        }

        public string Key { get; }
        public string Type { get; }
        public string Name { get; }
        public string Value { get; }
        public bool MustPreserve { get; }
    }
}
