using PrintProjects.Core.Interfaces;
using System;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;

namespace PrintProjects.Core.Model
{
    /// <summary>
    /// The Project class represents a git based 3D Print Project.
    /// It has a private constructor and the crucial properties have private setters.
    /// By using static 'Create' and 'Load' methods is is ensured, that a constructed
    /// project object is always valid.
    /// </summary>
    sealed public class Project : IEntity
    {
        private readonly GitClient _gitClient = new GitClient();

        private Project() { }

        public static Project Create(string name, string repositoryUrl, string repositoryBasePath)
        {
            if (name == null)
                throw new ArgumentNullException("Please provide a name for the project!");
            if (string.IsNullOrEmpty(repositoryUrl))
                throw new ArgumentNullException("Please provide a repository url!");
            if (string.IsNullOrEmpty(repositoryBasePath))
                throw new ArgumentNullException("Please provide a base path!");
            if (!Directory.Exists(repositoryBasePath))
                throw new ModelException("The given repository base path was not found!");

            var project = new Project()
            {
                Name = name,
                RepositoryUrl = repositoryUrl
            };
            project.ShortId = project.Id.GetShortGuid();
            project.RepositoryPath = Path.Combine(repositoryBasePath, project.ShortId);

            return project;
        }

        /// <summary>
        /// Clones/Pulls the project from the repository url.
        /// </summary>
        public void Update()
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
            ParseProjectFiles();

            LatestCommitInfos = _gitClient.GetLatestCommitInfos(RepositoryPath, 5);
            LastCommit = _gitClient.GetLastCommitDate(RepositoryPath);
            LastUpdate = DateTime.Now;
        }

        private void ParseProjectFiles()
        {
            var repositoryDirectory = new DirectoryInfo(RepositoryPath);

            var licenseFile = repositoryDirectory.GetFiles("license.md", SearchOption.TopDirectoryOnly).SingleOrDefault();
            License = licenseFile != null
                ? File.ReadAllText(licenseFile.FullName)
                : string.Empty;

            var readmeFile = repositoryDirectory.GetFiles("readme.md", SearchOption.TopDirectoryOnly).SingleOrDefault();
            Readme = readmeFile != null
                ? File.ReadAllText(readmeFile.FullName)
                : string.Empty;
        }

        public Guid Id { get; private set; } = Guid.NewGuid();

        public string ShortId { get; private set; }

        public string RepositoryPath { get; private set; }

        public string Name { get; private set; }

        public string RepositoryUrl { get; private set; }

        public string Readme { get; private set; }

        public string License { get; private set; }

        public Guid UserId { get; private set; }

        public DateTime LastUpdate { get; private set; }

        public DateTime LastCommit { get; private set; }

        public ReadOnlyCollection<CommitInfo> LatestCommitInfos { get; private set; }

        public DirectoryInfo ImageDirectory => new DirectoryInfo(Path.Combine(RepositoryPath, "images"));

        public DirectoryInfo CadDirectory => new DirectoryInfo(Path.Combine(RepositoryPath, "cad"));

        public DirectoryInfo StlDirectory => new DirectoryInfo(Path.Combine(RepositoryPath, "stl"));
    }
}
