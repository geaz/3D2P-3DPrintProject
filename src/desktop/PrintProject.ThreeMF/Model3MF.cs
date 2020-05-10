using System.IO;
using System.Linq;
using System.Text;
using PrintProject.Core;
using System.IO.Compression;
using PrintProject.Core.Model;
using System.Collections.Generic;
using PrintProject.ThreeMF.Model;
using System;

namespace PrintProject.ThreeMF
{
    public sealed class Model3MF
    {
        private readonly CModel _model = Wrapper.CreateModel();

        public static Model3MF FromBase64DataUrl(string dataUrl)
        {
            var basePos = dataUrl.IndexOf("base64,") + 7;
            dataUrl = dataUrl.Substring(basePos);

            var fileBytes = Convert.FromBase64String(dataUrl);
            return new Model3MF(fileBytes);
        }

        public Model3MF(byte[] fileBytes)
        {
            var reader = _model.QueryReader("3mf");
            reader.AddRelationToRead("http://schemas.openxmlformats.org/package/2006/relationships/mustpreserve");
            reader.ReadFromBuffer(fileBytes);
            LoadModel();
        }

        public Model3MF(string file)
        {
            var reader = _model.QueryReader("3mf");
            reader.AddRelationToRead("http://schemas.openxmlformats.org/package/2006/relationships/mustpreserve");
            reader.ReadFromFile(file);
            LoadModel();
        }

        public byte[] GetAttachment(string attachmenPath)
        {
            byte[] attachmentBytes = null;
            for(uint i = 0; i < _model.GetAttachmentCount(); i++)
            {
                var attachment = _model.GetAttachment(i);
                if(attachment.GetPath() == attachmenPath)
                {
                    attachment.WriteToBuffer(out attachmentBytes);
                    break;
                }
            }
            return attachmentBytes;
        }

        public void ExtractPrintProject(string directory)
        {
            if(!Directory.Exists(directory))
                throw new ModelException("Directory does not exist!");

            var stlFolder = Path.Combine(directory, "stl");
            if(!Directory.Exists(stlFolder))
                Directory.CreateDirectory(stlFolder);

            foreach(var mesh in Meshes)
            {
                var stlModel = Wrapper.CreateModel();
                var stlMesh = stlModel.AddMeshObject();
                stlMesh.SetName(mesh.Name);
                stlMesh.SetGeometry(mesh.NativeVertices, mesh.NativeTriangles);
                stlModel.AddBuildItem(stlMesh, Wrapper.GetIdentityTransform());

                var stlWriter = stlModel.QueryWriter("stl");
                stlWriter.WriteToFile(Path.Combine(stlFolder, stlMesh.GetName()));
            }
            ZipFile.CreateFromDirectory(stlFolder, Path.Combine(directory, "stls.zip"));

            if(!string.IsNullOrEmpty(Readme)) File.WriteAllText(Path.Combine(directory, "README.md"), Readme);
            ProjectFile?.Save(Path.Combine(directory, "3D2P.json"), true);
        }

        private void LoadModel()
        {
            LoadReadme();
            LoadColors();
            LoadMeshes();
            LoadProjectFile();
        }

        private void LoadReadme()
        {
            var readmeBytes = GetAttachment("/Metadata/README.md");
            if(readmeBytes != null)
                Readme = Encoding.UTF8.GetString(readmeBytes, 0, readmeBytes.Length);
        }

        private void LoadColors()
        {
            Colors = new List<Color>();
            var colorIterator = _model.GetColorGroups();
            while(colorIterator.MoveNext())
            {
                var colorGroup = colorIterator.GetCurrentColorGroup();
                colorGroup.GetAllPropertyIDs(out uint[] propertyIds);

                foreach(var propertyId in propertyIds)
                {
                    var color = new Color(
                        colorGroup.GetResourceID(),
                        propertyId,
                        colorGroup.GetColor(propertyId)
                    );
                    Colors.Add(color);
                }
            }
        }

        private void LoadMeshes()
        {
            var meshList = new List<CMeshObject>();
            var meshObjectIterator = _model.GetMeshObjects();
            while(meshObjectIterator.MoveNext())
            {
                meshList.Add(meshObjectIterator.GetCurrentMeshObject());
            }
            Meshes = meshList
                .Select(m => new Mesh(m))
                .ToList();
        }

        private void LoadProjectFile()
        {
            var projectFileBytes = GetAttachment("/Metadata/3D2P.json");
            if(projectFileBytes != null)
            {
                ProjectFile = ProjectFile.Load(projectFileBytes);
            }
            // If no 3D2P.json projectfile was found,
            // create a default one for unknown projects.
            else
            {
                ProjectFile = new ProjectFile
                {
                    Name = "Unknown Project",
                    Id = null,
                    Status = Status.Unknown
                };

                for (var i = 0; i < Meshes.Count; i++)
                {
                    var mesh = Meshes[i];
                    var stlName = string.IsNullOrEmpty(mesh.Name)
                        ? $"{i}.stl"
                        : mesh.Name;
                    stlName = stlName.EndsWith(".STL", System.StringComparison.OrdinalIgnoreCase)
                        ? stlName
                        : $"{stlName}.stl";

                    var stlInfo = new StlInfo
                    {
                        Name = stlName,
                        Status = Status.Unknown,
                    };
                    mesh.Name = stlName;
                    ProjectFile.StlInfoList.Add(stlInfo);
                }
            }
        }

        public string Readme { get; private set; }
        public ProjectFile ProjectFile { get; private set; }
        public List<Mesh> Meshes { get; private set; }
        public List<Color> Colors { get; private set; }
    }
}
