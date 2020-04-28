using System.IO;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace PrintProjects.Core.Model
{
    public sealed class ProjectFile
    {
        public static ProjectFile Load(string projectFilePath)
        {
            if(!File.Exists(projectFilePath))
                throw new ModelException("3D2P.json does not exist!");
            else if(Path.GetFileName(projectFilePath).ToUpper() != "3D2P.JSON")
                throw new ModelException("Please provide a 3D2P.json file!");

            return JsonConvert.DeserializeObject<ProjectFile>(File.ReadAllText(projectFilePath));
        }

        public void Write(string projectFilePath, bool overwrite)
        {
            if(File.Exists(projectFilePath) && !overwrite)
                throw new ModelException($"File already exists!");
            
            File.WriteAllText(projectFilePath, JsonConvert.SerializeObject(this));
        }

        [JsonProperty("name")]
        public string Name { get; set; } = "Mysterious unnamed project";

        [JsonProperty("thumbnail")]
        public string Thumbnail { get; set; }

        [JsonProperty("status")]
        public string Status { get; set; } = "WIP";

        [JsonProperty("stls")]
        public List<StlInfo> StlInfoList { get; set; } = new List<StlInfo>();
    }
}