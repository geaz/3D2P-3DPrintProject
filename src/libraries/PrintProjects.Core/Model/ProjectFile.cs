using System.IO;
using System.Text;
using Newtonsoft.Json;
using System.Collections.Generic;
using System;

namespace PrintProjects.Core.Model
{
    public enum Status
    {
        Unknown,
        WIP,
        Done
    }

    public sealed class ProjectFile
    {
        public static string ProjectFileName = "3D2P.json"; 

        public static ProjectFile Load(string projectFilePath)
        {
            if(!File.Exists(projectFilePath))
                throw new ModelException("3D2P.json does not exist!");
            else if(Path.GetFileName(projectFilePath).ToUpper() != "3D2P.JSON")
                throw new ModelException("Please provide a 3D2P.json file!");

            return JsonConvert.DeserializeObject<ProjectFile>(File.ReadAllText(projectFilePath));
        }

        public static ProjectFile Load(byte[] projectFileBytes)
        {
            if(projectFileBytes == null)
                throw new ModelException("Byte array is null!");
                
            return JsonConvert.DeserializeObject<ProjectFile>(Encoding.UTF8.GetString(projectFileBytes));
        }

        public void Save(string projectFilePath, bool overwrite)
        {
            if(File.Exists(projectFilePath) && !overwrite)
                throw new ModelException($"File already exists!");
            
            File.WriteAllText(projectFilePath, JsonConvert.SerializeObject(this));
        }

        [JsonProperty("id")]
        public string Id { get; set; } = Guid.NewGuid().GetShortGuid();

        [JsonProperty("name")]
        public string Name { get; set; } = "Mysterious unnamed project";

        [JsonProperty("thumbnail")]
        public string Thumbnail { get; set; }

        [JsonProperty("readme")]
        public string Readme { get; set; }

        [JsonProperty("status")]
        public Status Status { get; set; } = Status.WIP;

        [JsonProperty("stlInfoList")]
        public List<StlInfo> StlInfoList { get; set; } = new List<StlInfo>();
    }
}