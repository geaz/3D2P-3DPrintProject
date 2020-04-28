using System;
using System.Runtime.Serialization;

namespace PrintProjects.Core
{
    public class ModelException : Exception
    {
        public ModelException() { }
        public ModelException(string message) : base(message) { }
        public ModelException(string message, Exception innerException) : base(message, innerException) { }
        protected ModelException(SerializationInfo info, StreamingContext context) : base(info, context) { }
    }
}
