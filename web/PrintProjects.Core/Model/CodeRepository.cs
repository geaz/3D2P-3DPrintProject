using System;
using System.Net;

namespace PrintProjects.Core.Model
{
    public sealed class CodeRepository
    {
        public CodeRepository(string repositoryUrl, string rawRepositoryUrl)
        {
            RepositoryUri = new Uri(repositoryUrl);
            RawRepositoryUri = new Uri(rawRepositoryUrl);
        }

        /// <summary>
        /// This methods checks, if the project file exists in the remote repository by checking the raw url path.
        /// </summary>
        public bool ProjectFileExists()
        {
            var result = true;
            var request = HttpWebRequest.Create(new Uri(RawRepositoryUri, Project.ProjectFileName));
            request.Timeout = 10000;
            try
            {
                request.GetResponse();
            }
            catch
            {
                result = false;
            }
            return result;
        }

        public Uri RepositoryUri { get; private set; }
        public Uri RawRepositoryUri { get; private set; }
    }
}