using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using PrintProjects.Core.Interfaces;

namespace PrintProjects.Core.Model
{
    public sealed class ProjectStatus
    {
        public static readonly string WIP = "WIP";
        public static readonly string DONE = "Done";
    }

    /// <summary>
    /// The Project class represents a git based 3D Print Project.
    /// It has a private constructor and the crucial properties have private setters.
    /// By using static 'Create' and 'Load' methods it is ensured, that a constructed
    /// project object is always valid.
    /// </summary>
    public sealed class Project : IEntity
    {
        public static string PROJECT_FILE_NAME = "3D2P.json";

        private Project() { }

        public static Project Create(string repositoryUrl, string rawRepositoryUrl, string downloadBasePath)
        {
            if (string.IsNullOrEmpty(repositoryUrl))
                throw new ArgumentNullException("Please provide a repository url!");
            if (string.IsNullOrEmpty(rawRepositoryUrl))
                throw new ArgumentNullException("Please provide a raw repository url!");
            if (string.IsNullOrEmpty(downloadBasePath))
                throw new ArgumentNullException("Please provide a base path for the project download!");
            if (!Directory.Exists(downloadBasePath))
                throw new ModelException("The given download base path was not found!");

            var project = new Project()
            {
                CodeRepository = new CodeRepository(repositoryUrl, rawRepositoryUrl)
            };
            project.ShortId = project.Id.GetShortGuid();
            project.DataPath = Path.Combine(downloadBasePath, project.ShortId);

            return project;
        }

        /// <summary>
        /// Downloads and processes the 3d2p.json of the given repository.
        /// </summary>
        public void Update()
        {
            // Delete the old data first
            if(Directory.Exists(DataPath)) Directory.Delete(DataPath, true);
            Directory.CreateDirectory(DataPath);

            var projectFile = CodeRepository.DownloadProjectFile(DataPath);

            Name = projectFile.Name;
            Status = projectFile.Status;
            StlInfoList = projectFile.StlInfoList;
            GalleryInfoList = projectFile.GalleryInfoList;
            LastUpdate = DateTime.Now;

            CodeRepository.DownloadMultiple(StlInfoList.Select(s => s.RelativePath).ToList(), DataPath);
            CodeRepository.DownloadMultiple(GalleryInfoList.Select(s => s.RelativePath).ToList(), DataPath);

            if(CodeRepository.RemoteFileExists("README")) Readme = CodeRepository.ReadRemoteFile("README", DataPath);
            else if(CodeRepository.RemoteFileExists("README.md")) Readme = CodeRepository.ReadRemoteFile("README.md", DataPath);

            if(CodeRepository.RemoteFileExists("LICENSE")) License = CodeRepository.ReadRemoteFile("LICENSE", DataPath);
            else if(CodeRepository.RemoteFileExists("LICENSE.md")) License = CodeRepository.ReadRemoteFile("LICENSE.md", DataPath);
        }

        public Guid Id { get; private set; } = Guid.NewGuid();

        public string ShortId { get; private set; }

        public string Name { get; private set; }

        public string Status { get; private set; }

        public string Readme { get; private set; }

        public string License { get; private set; }

        public string DataPath {get; private set; }

        public List<StlInfo> StlInfoList { get; private set; }

        public List<GalleryInfo> GalleryInfoList { get; private set; }

        public DateTime LastUpdate { get; private set; }

        public CodeRepository CodeRepository { get; private set; }
    }
}
