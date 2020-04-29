using Newtonsoft.Json;

namespace PrintProjects.Core.Model
{
    public sealed class StlAnnotation
    {
        [JsonProperty("id")]
        public int Id { get; set; }

        [JsonProperty("text")]
        public string Text { get; set; }

        [JsonProperty("x")]
        public decimal X { get; set; }

        [JsonProperty("y")]
        public decimal Y { get; set; }

        [JsonProperty("z")]
        public decimal Z { get; set; }
    }
}