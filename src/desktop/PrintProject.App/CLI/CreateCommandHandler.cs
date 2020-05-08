using System;
using System.IO;
using System.CommandLine;
using PrintProject.Core.Model;
using System.CommandLine.Invocation;

namespace PrintProject.App.CLI
{
    internal sealed class CreateCommandHandler
    {
        public CreateCommandHandler()
        {
            BuildCommand();
        }

        private void BuildCommand()
        {
            var directoryOption = new Option<DirectoryInfo>("--dir")
            {
                Description = "The directory to create the 3D2P.json file.",
                Required = true
            };
            var overwriteOption = new Option<bool>("--overwrite", "Use to overwrite any exisiting 3D2P.json file in the target directory.");

            Command.Add(directoryOption);
            Command.Add(overwriteOption);
            Command.Handler = CommandHandler.Create<DirectoryInfo, bool>(HandleCreateCommand);
        }

        private void HandleCreateCommand(DirectoryInfo dir, bool overwrite)
        {
            Console.WriteLine("Creating new 3D2P.json file ...");

            var projectFile = new ProjectFile();
            projectFile.Save(Path.Combine(dir.FullName, ProjectFile.ProjectFileName), overwrite);

            Console.WriteLine($"Saved 3D2P.json to '{dir.FullName}' (overwrite: {overwrite})");
        }

        public Command Command { get; } = new Command("create", "Create a new project file.");
    }
}