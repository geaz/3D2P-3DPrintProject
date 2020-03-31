using Newtonsoft.Json;

namespace PrintProjects.Core.Model
{
    public sealed class GalleryInfo
    {
        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("relativePath")]
        public string RelativePath { get; set; }

        [JsonProperty("order")]
        public int Order { get; set; }
    }
}