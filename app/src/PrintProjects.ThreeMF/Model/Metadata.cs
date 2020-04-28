namespace PrintProjects.ThreeMF.Model
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

        public string Key { get; private set; }
        public string Type { get; private set; }
        public string Name { get; private set; }
        public string Value { get; private set; }
        public bool MustPreserve { get; private set; }
    }
}
