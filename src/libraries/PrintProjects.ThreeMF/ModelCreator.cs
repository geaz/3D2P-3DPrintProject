using System.Linq;
using System.Collections.Generic;
using PrintProjects.ThreeMF.Model;
using System;
using System.Text;

namespace PrintProjects.ThreeMF
{
    public sealed class ModelCreator
    {
        private readonly CModel _model = Wrapper.CreateModel();

        public ModelCreator(string file)
        {
            var reader = _model.QueryReader("3mf");
            reader.AddRelationToRead("http://schemas.openxmlformats.org/package/2006/relationships/mustpreserve");
            reader.ReadFromFile(file);

        }
    }
}
