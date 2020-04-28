using Newtonsoft.Json;

namespace PrintProjects.Core.Model
{
    public sealed class StlInfo
    {
        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("relativePath")]
        public string RelativePath { get; set; }

        [JsonProperty("status")]
        public string Status { get; set; }
    }
}