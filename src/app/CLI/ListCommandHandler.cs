using System.IO;
using System.CommandLine;
using PrintProjects.Core.Model;
using System.CommandLine.Invocation;
using System;
using System.Linq;

namespace PrintProjects.App.CLI
{
    internal sealed class ListCommandHandler
    {
        public ListCommandHandler()
        {
            BuildCommand();
        }

        private void BuildCommand()
        {
            var listStlsCommand = new Command("stls", "List stls in existing project file.")
            {
                new Option("--project", "Existing project file.")
                {
                    Required = true,
                    Argument = new Argument<FileInfo>().ExistingOnly()
                }
            };
            listStlsCommand.Handler = CommandHandler.Create<FileInfo>(HandleListStlsCommand);

            var listAnnotationsCommand = new Command("annotations", "List annotations of a stl in an existing project.")
            {
                new Option("--project", "Existing project file.")
                {
                    Required = true,
                    Argument = new Argument<FileInfo>().ExistingOnly()
                },
                new Option<string>("--stl-name", "Name of the stl to list the annotations.")
                {
                    Required = true
                }
            };
            listAnnotationsCommand.Handler = CommandHandler.Create<FileInfo, string>(HandleListAnnotationsCommand);

            Command.Add(listStlsCommand);
            Command.Add(listAnnotationsCommand);
        }

        private void HandleListStlsCommand(FileInfo project)
        {
            var projectFile = ProjectFile.Load(project.FullName);
            Console.WriteLine($"Project at '{project.FullName}' includes the following STLs:");
            foreach(var stl in projectFile.StlInfoList)
            {
                Console.WriteLine($"- {stl.Name} ({stl.Status.ToString()}, {stl.Color}, Annotations: {stl.Annotations.Count})");
            }
        }

        private void HandleListAnnotationsCommand(FileInfo project, string stlName)
        {
            var projectFile = ProjectFile.Load(project.FullName);
            var stl = projectFile.StlInfoList.SingleOrDefault(s => s.Name == stlName);
            
            if(stl != null)
            {
                foreach(var annotation in stl.Annotations)
                {
                    Console.WriteLine($"- ID: {annotation.Id}, Text: {annotation.Text}");
                }
            }
            else
            {
                Console.WriteLine($"STL with name '{stlName}' not found in project!");
            }
        }

        public Command Command { get; } = new Command("list", "List stls and annotations in project file.");
    }
}