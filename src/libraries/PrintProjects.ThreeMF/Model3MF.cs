using System.IO;
using System.Linq;
using System.Text;
using PrintProjects.Core;
using PrintProjects.Core.Model;
using System.Collections.Generic;
using PrintProjects.ThreeMF.Model;

namespace PrintProjects.ThreeMF
{
    public sealed class Model3MF
    {
        private readonly CModel _model = Wrapper.CreateModel();

        public Model3MF(string file)
        {
            var reader = _model.QueryReader("3mf");
            reader.AddRelationToRead("http://schemas.openxmlformats.org/package/2006/relationships/mustpreserve");
            reader.ReadFromFile(file);

            LoadReadme();
            LoadColors();
            LoadMeshes();
            LoadProjectFile();
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

            foreach(var mesh in Meshes)
            {
                var stlModel = Wrapper.CreateModel();
                var stlMesh = stlModel.AddMeshObject();
                stlMesh.SetName(mesh.Name);
                stlMesh.SetGeometry(mesh.NativeVertices, mesh.NativeTriangles);
                stlModel.AddBuildItem(stlMesh, Wrapper.GetIdentityTransform());

                var stlWriter = stlModel.QueryWriter("stl");
                stlWriter.WriteToFile(Path.Combine(directory, stlMesh.GetName()));
            }
            if(!string.IsNullOrEmpty(Readme)) File.WriteAllText(Path.Combine(directory, "README.md"), Readme);
            ProjectFile?.Save(Path.Combine(directory, "3D2P.json"), true);
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
