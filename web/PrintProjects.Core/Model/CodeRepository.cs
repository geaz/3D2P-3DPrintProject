using System;
using System.Collections.Generic;
using System.IO;
using System.Net;

namespace PrintProjects.Core.Model
{
    public sealed class CodeRepository
    {
        public CodeRepository(string repositoryUrl, string rawRepositoryUrl)
        {
            if(!rawRepositoryUrl.EndsWith("/"))
                throw new ModelException("The raw repository url has to end with a slash '/'!");

            RepositoryUrl = repositoryUrl;
            RawRepositoryUrl = rawRepositoryUrl;
        }

        /// <summary>
        /// This methods checks, if the given remote file exists in the remote repository by checking the raw url path.
        /// </summary>
        /// <param name="remoteRelativeFileUrl">The remote relative file url.</param>
        /// <returns>
        /// True, if the file exists.
        /// </returns>
        public bool RemoteFileExists(string remoteRelativeFileUrl)
        {
            var result = true;
            var request = HttpWebRequest.Create(new Uri(RawRepositoryUri, remoteRelativeFileUrl));
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

        /// <summary>
        /// Downloads the file specified by its relative remote url and returns its content.
        /// </summary>
        /// <param name="remoteRelativeUrl">The remote relative file url.</param>
        /// <param name="downloadPath">
        /// The path to download the file. 
        /// Every needed subdirectory will be created by this method.
        /// </param>
        /// <returns>
        /// Content of the remote file.
        /// </returns>
        public string ReadRemoteFile(string remoteRelativeUrl, string downloadPath)
        {
            var tempDirectory = Path.GetTempPath();
            var tempFile = Path.Combine(tempDirectory, remoteRelativeUrl);

            Download(remoteRelativeUrl, tempDirectory);
            var content = File.ReadAllText(tempFile);
            File.Delete(tempFile);

            return content;
        }

        /// <summary>
        /// Downloads the projectfile of the repository
        /// into the given path and returns the parsed json.
        /// </summary>
        /// <param name="downloadPath">
        /// The path to download the file. 
        /// Every needed subdirectory will be created by this method.
        /// </param>
        /// <returns>
        /// The parsed json project file. Or null, if not present in the remote repository.
        /// </returns>
        public ProjectFile DownloadProjectFile(string downloadPath)
        {
            Download(Project.PROJECT_FILE_NAME, downloadPath);
            return ProjectFile.Load(Path.Combine(downloadPath, Project.PROJECT_FILE_NAME));
        }

        /// <summary>
        /// Downloads the file specified by its relative remote url.
        /// </summary>
        /// <param name="remoteRelativeUrl">The remote relative file url.</param>
        /// <param name="baseDownloadPath">
        /// The base path to download the file. 
        /// Every subdirectory will be created by this method.
        /// </param>
        /// <returns>
        /// True, if the download was successfully.
        /// </returns>
        public void Download(string remoteRelativeUrl, string baseDownloadPath)
        {
            var remoteFileUrl = new Uri(RawRepositoryUri, remoteRelativeUrl);
            var downloadFilePath = Path.Combine(baseDownloadPath, remoteRelativeUrl);
            var downloadDirectory = Path.GetDirectoryName(downloadFilePath);

            if(!Directory.Exists(downloadDirectory))
                Directory.CreateDirectory(downloadDirectory);

            using(var webClient = new WebClient())
            {
                webClient.DownloadFile(remoteFileUrl, downloadFilePath);
            }
        }

        /// <summary>
        /// Downloads the list of files specified by its relative remote url.
        /// </summary>
        /// <param name="remoteRelativeUrlList">The list of remote relative file urls.</param>
        /// <param name="baseDownloadPath">
        /// The base path to download the file. 
        /// Every subdirectory will be created by this method.
        /// </param>
        public void DownloadMultiple(List<string> remoteRelativeUrlList, string baseDownloadPath)
        {
            foreach(var remoteRelativeUrl in remoteRelativeUrlList)
            {
                Download(remoteRelativeUrl, baseDownloadPath);
            }
        }

        public string RepositoryUrl { get; private set; }
        public string RawRepositoryUrl { get; private set; }

        public Uri RepositoryUri => new Uri(RepositoryUrl);
        public Uri RawRepositoryUri => new Uri(RawRepositoryUrl);
    }
}