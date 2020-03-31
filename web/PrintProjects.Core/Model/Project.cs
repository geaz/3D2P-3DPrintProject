using System;
using System.IO;
using PrintProjects.Core.Interfaces;

namespace PrintProjects.Core.Model
{
    /// <summary>
    /// The Project class represents a git based 3D Print Project.
    /// It has a private constructor and the crucial properties have private setters.
    /// By using static 'Create' and 'Load' methods it is ensured, that a constructed
    /// project object is always valid.
    /// </summary>
    public sealed class Project : IEntity
    {
        public static string ProjectFileName = "3D2P.json";

        private Project() { }

        public static Project Create(
            string name, string repositoryUrl, 
            string rawRepositoryUrl, string downloadBasePath)
        {
            if (string.IsNullOrEmpty(name))
                throw new ArgumentNullException("Please provide a name for the project!");
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
                Name = name,
                CodeRepository = new CodeRepository(repositoryUrl, rawRepositoryUrl)
            };
            project.ShortId = project.Id.GetShortGuid();
            project.DataPath = Path.Combine(downloadBasePath, project.ShortId);
            
            if(!Directory.Exists(project.DataPath))
                Directory.CreateDirectory(project.DataPath);

            return project;
        }

        /// <summary>
        /// Downloads and processes the 3d2p.json of the given repository.
        /// </summary>
        public void Update()
        {
            if(!CodeRepository.ProjectFileExists())
                throw new ModelException($"The project file was not found in the repository!");

            LastUpdate = DateTime.Now;
        }

        public Guid Id { get; private set; } = Guid.NewGuid();

        public string ShortId { get; private set; }

        public string Name { get; private set; }

        public string Readme { get; private set; }

        public string License { get; private set; }

        public string DataPath {get; private set; }

        public DateTime LastUpdate { get; private set; }

        public CodeRepository CodeRepository { get; private set; }
    }
}
