using System;
using System.IO;
using System.Linq;
using System.CommandLine;
using PrintProject.Core.Model;
using System.CommandLine.Invocation;

namespace PrintProject.App.CLI
{
    internal sealed class RemoveCommandHandler
    {
        public RemoveCommandHandler()
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
            var stlOption = new Option<string>("--stl-name", "Name of the stl to remove (Matches the name of the file, added to the project).")
                {
                    Required = true,
                };

            Command.Add(projectOption);
            Command.Add(stlOption);
            Command.Handler = CommandHandler.Create<FileInfo, string>(HandleRemoveStlCommand);
        }

        private void HandleRemoveStlCommand(FileInfo project, string stlName)
        {
            var projectFile = ProjectFile.Load(project.FullName);
            var stl = projectFile.StlInfoList.SingleOrDefault(s => s.Name == stlName);

            if(stl != null)
            {
                projectFile.StlInfoList.Remove(stl);
                projectFile.Save(project.FullName, true);
                Console.WriteLine($"Removed stl '{stlName}' from project.");
            }
            else
            {
                Console.WriteLine($"STL with name '{stlName}' not found in project!");
            }
        }

        public Command Command { get; } = new Command("remove", "Remove a stl from an existing project.");
    }
}