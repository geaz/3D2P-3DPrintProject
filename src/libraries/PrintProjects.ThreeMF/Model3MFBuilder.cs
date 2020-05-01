using System.IO;
using PrintProjects.Core;

namespace PrintProjects.ThreeMF
{
    public sealed class Model3MFBuilder
    {
        private readonly CModel _model = Wrapper.CreateModel();

        public Model3MFBuilder()
        {
            _model.AddCustomContentType("md", "test/markdown");
            _model.AddCustomContentType("json", "application/json");
        }

        public void SetReadme(string readmeFilepath) => AddAttachment("/Metadata/README.md", readmeFilepath);
        public void Set3D2PFile(string projectFilepath) => AddAttachment("/Metadata/3D2P.json", projectFilepath);

        public void SetThumbnail(string thumbnailFilePath)
        {
            if(!File.Exists(thumbnailFilePath))
                throw new ModelException($"File '{thumbnailFilePath}' does not exist!");

            _model.RemovePackageThumbnailAttachment();
            var attachment = _model.CreatePackageThumbnailAttachment();
            attachment.ReadFromFile(thumbnailFilePath);
        }

        public void AddStl(string stlFilepath)
        {
            if(!File.Exists(stlFilepath))
                throw new ModelException($"STL file '{stlFilepath}' does not exist!");

            var stlModel = Wrapper.CreateModel();
            var stlReader = stlModel.QueryReader("stl");
            stlReader.ReadFromFile(stlFilepath);

            var stlMeshObjects = stlModel.GetMeshObjects();
            if (stlMeshObjects.Count() == 0)
                throw new ModelException("Error occured while reading stl (lib3mf reader - 0).");
            else if (stlMeshObjects.Count() > 1)
                throw new ModelException("Error occured while reading stl (lib3mf reader > 1).");

            stlMeshObjects.MoveNext();
            var stlMeshObject = stlMeshObjects.GetCurrentMeshObject();
            stlMeshObject.GetVertices(out sPosition[] vertices);
            stlMeshObject.GetTriangleIndices(out sTriangle[] triangles);

            var newMeshObject = _model.AddMeshObject();
            newMeshObject.SetName(Path.GetFileName(stlFilepath));
            newMeshObject.SetGeometry(vertices, triangles);

            _model.AddBuildItem(newMeshObject, Wrapper.GetIdentityTransform());
        }

        public void Write3MF(string filepath, bool overwrite)
        {
            if(File.Exists(filepath) && !overwrite)
                throw new ModelException($"File already exists!");

            var writer = _model.QueryWriter("3mf");
            writer.WriteToFile(filepath);
        }

        private CAttachment AddAttachment(string packagePath, string filepath)
        {
            if(!File.Exists(filepath))
                throw new ModelException($"File '{filepath}' does not exist!");

            // Check for existing Readme File
            CAttachment fileAttachment = null;
            for(uint i = 0; i < _model.GetAttachmentCount(); i++)
            {
                var attachment = _model.GetAttachment(i);
                if(attachment.GetPath() == packagePath)
                {
                    fileAttachment = attachment;
                    break;
                }
            }

            if(fileAttachment == null)
            {
                fileAttachment = _model.AddAttachment(
                    packagePath,
                    "http://schemas.openxmlformats.org/package/2006/relationships/mustpreserve");
            }

            fileAttachment.ReadFromFile(filepath);
            return fileAttachment;
        }
    }
}
