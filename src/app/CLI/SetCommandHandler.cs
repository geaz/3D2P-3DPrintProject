using System.IO;
using System.CommandLine;
using PrintProjects.Core.Model;
using System.CommandLine.Invocation;
using System;

namespace PrintProjects.App.CLI
{
    internal sealed class SetCommandHandler
    {
        public SetCommandHandler()
        {
            BuildCommand();
        }

        private void BuildCommand()
        {
            var projectOption = new Option<FileInfo>("--project", "Path to project to change.") { Required = true };
            var nameOption = new Option<string>("--name", "Set the project name.");
            var statusOption = new Option<Status?>("--status", "Set the project status.");
            var thumbnailOption = new Option<FileInfo>("--thumbnail", "Set the thumbnail path.");
            var readmeOption = new Option<FileInfo>("--readme", "Set the readme path.");

            Command.Add(projectOption);
            Command.Add(nameOption);
            Command.Add(statusOption);
            Command.Add(thumbnailOption);
            Command.Add(readmeOption);
            Command.Handler = CommandHandler
                .Create<FileInfo, string, Status?, FileInfo, FileInfo>(HandleSetCommand);
        }

        private void HandleSetCommand(FileInfo project, string name, Status? status, FileInfo thumbnail, FileInfo readme)
        {
            var projectFile = ProjectFile.Load(project.FullName);
            projectFile.Name = !string.IsNullOrEmpty(name) ? name : projectFile.Name;
            projectFile.Status = status != null ? status.Value : projectFile.Status;
            projectFile.Thumbnail = thumbnail != null ? Path.GetRelativePath(project.DirectoryName, thumbnail.FullName) : projectFile.Thumbnail;
            projectFile.Readme = readme != null ? Path.GetRelativePath(project.DirectoryName, readme.FullName) : projectFile.Readme;
            projectFile.Save(project.FullName, true);
            Console.WriteLine("Project values set.");
        }

        public Command Command { get; } = new Command("set", "Set properties of an existing project.");
    }
}