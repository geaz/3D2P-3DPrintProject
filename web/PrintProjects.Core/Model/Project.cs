using System;
using System.IO;
using System.Collections.Generic;
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
        private readonly GitClient _gitClient = new GitClient();

        private Project() { }

        public static Project Create(string repositoryUrl, string downloadBasePath)
        {
            if (string.IsNullOrEmpty(repositoryUrl))
                throw new ArgumentNullException("Please provide a repository url!");
            if (string.IsNullOrEmpty(downloadBasePath))
                throw new ArgumentNullException("Please provide a base path for the project download!");
            if (!Directory.Exists(downloadBasePath))
                throw new ModelException("The given download base path was not found!");

            var project = new Project();
            project.RepositoryUrl = repositoryUrl;
            project.ShortId = project.Id.GetShortGuid();
            project.RepositoryPath = Path.Combine(downloadBasePath, project.ShortId);

            return project;
        }

        /// <summary>
        /// Clones/pulls the repository and processes the 3d2p.json.
        /// </summary>
        public void Update()
        {
            UpdateFiles();
            var projectFile = ProjectFile.Load(Path.Combine(RepositoryPath, PROJECT_FILE_NAME));

            Name = projectFile.Name;
            Status = projectFile.Status;
            StlInfoList = projectFile.StlInfoList;
            CoverImage = projectFile.CoverImage;
            LastUpdate = DateTime.Now;
      
            if(FileExists("README")) Readme = File.ReadAllText(Path.Combine(RepositoryPath, "README"));
            else if(FileExists("README.md")) Readme = File.ReadAllText(Path.Combine(RepositoryPath, "README.md"));
        }

        public void Delete()
        {
            UpdateFiles();
            if(FileExists(PROJECT_FILE_NAME)) throw new ModelException("Repository still contains 3D2P.json file. Please remove it from the repository to delete the project!");
            else _gitClient.DeleteGitFolder(RepositoryPath);
        }

        /// <summary>
        /// Clones/pulls the repository.
        /// </summary>
        private void UpdateFiles()
        {
            var repositoryDirectory = new DirectoryInfo(RepositoryPath);
            if (repositoryDirectory.Exists)
            {
                _gitClient.Pull(RepositoryPath);
            }
            else
            {
                repositoryDirectory.Create();
                _gitClient.Clone(RepositoryPath, RepositoryUrl);
            }
        }

        private bool FileExists(string relativePath)
        {
            var filePath = Path.Combine(RepositoryPath, relativePath);
            return File.Exists(filePath);
        }

        public Guid Id { get; private set; } = Guid.NewGuid();

        public string ShortId { get; private set; }

        public string Name { get; private set; }

        public string Status { get; private set; }

        public string Readme { get; private set; }

        public string CoverImage { get; private set; }

        public string RepositoryPath {get; private set; }

        public string RepositoryUrl { get; private set; }

        public List<StlInfo> StlInfoList { get; private set; }

        public DateTime LastUpdate { get; private set; }
    }
}
