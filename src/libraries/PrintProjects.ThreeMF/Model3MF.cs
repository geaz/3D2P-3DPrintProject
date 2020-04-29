using System.Linq;
using System.Text;
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
        }

        private void LoadReadme()
        {
            var l = _model.GetMetaDataGroup();
            var k = l.GetMetaDataCount();
            for(uint i = 0; i < _model.GetAttachmentCount(); i++)
            {
                var attachment = _model.GetAttachment(i);
                if(attachment.GetPath() == "/Metadata/README.md")
                {
                    var fileSize = attachment.GetStreamSize();

                    var fileBytes = new byte[fileSize];
                    attachment.WriteToBuffer(out fileBytes);

                    Readme = Encoding.UTF8.GetString(fileBytes, 0, fileBytes.Length);
                    break;
                }       
            }
        }

        private void LoadColors()
        {
            Colors = new List<Color>();
            var colorIterator = _model.GetColorGroups();
            while(colorIterator.MoveNext())
            {                
                uint[] propertyIds;
                var colorGroup = colorIterator.GetCurrentColorGroup();
                colorGroup.GetAllPropertyIDs(out propertyIds);

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

        public string Readme { get; private set; }
        public List<Mesh> Meshes { get; private set; }
        public List<Color> Colors { get; private set; }
    }
}
