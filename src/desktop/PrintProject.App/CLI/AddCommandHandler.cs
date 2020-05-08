using System;
using System.IO;
using System.Linq;
using System.CommandLine;
using PrintProject.Core.Model;
using System.CommandLine.Invocation;

namespace PrintProject.App.CLI
{
    internal sealed class AddCommandHandler
    {
        public AddCommandHandler()
        {
            BuildCommand();
        }

        private void BuildCommand()
        {
            var projectOption = new Option("--project", "Existing project file.")
                {
                    Required = true,
                    Argument = new Argument<FileInfo>().ExistingOnly()
                };
            var stlOption = new Option("--stl", "Path to stl file.")
                {
                    Required = true,
                    Argument = new Argument<FileInfo>().ExistingOnly()
                };
            var colorOption = new Option<string>("--color", getDefaultValue: () => "#F58026", description: "Color of the stl (#F58026).");
            var statusOption = new Option<Status>("--status", getDefaultValue: () => Status.WIP, description: "Status of the stl (WIP, Done).");

            Command.Add(projectOption);
            Command.Add(stlOption);
            Command.Add(colorOption);
            Command.Add(statusOption);
            Command.Handler = CommandHandler.Create<FileInfo, FileInfo, string, Status>(HandleAddStlCommand);
        }

        private void HandleAddStlCommand(FileInfo project, FileInfo stl, string color, Status status)
        {
            var relativeStlPath = Path.GetRelativePath(project.DirectoryName, stl.FullName);
            
            var projectFile = ProjectFile.Load(project.FullName);
            var existingStl = projectFile.StlInfoList.Where(s => s.RelativePath == relativeStlPath);
            if(existingStl != null) {
                var stlInfo = new StlInfo()
                {
                    Name = stl.Name,
                    RelativePath = Path.GetRelativePath(project.DirectoryName, stl.FullName),
                    Status = status,
                    Color = color
                };
                projectFile.StlInfoList.Add(stlInfo);
                projectFile.Save(project.FullName, true);
                Console.WriteLine("Added stl to project file.");
            }
            else {
                Console.WriteLine("Skipping - STL already in project!");
            }
        }

        public Command Command { get; } = new Command("add", "Add a stl to an existing project.");
    }
}