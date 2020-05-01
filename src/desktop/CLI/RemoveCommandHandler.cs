using System.IO;
using System.CommandLine;
using PrintProjects.Core.Model;
using System.CommandLine.Invocation;
using System;
using System.Linq;

namespace PrintProjects.App.CLI
{
    internal sealed class RemoveCommandHandler
    {
        public RemoveCommandHandler()
        {
            BuildCommand();
        }

        private void BuildCommand()
        {
            var removeStlCommand = new Command("stl", "Remove a stl from an existing project file.")
            {
                new Option("--project", "Existing project file.")
                {
                    Required = true,
                    Argument = new Argument<FileInfo>().ExistingOnly()
                },
                new Option<string>("--stl-name", "Name of the stl to add the annotation to (Matches the name of the file, added to the project).")
                {
                    Required = true,
                }
            };
            removeStlCommand.Handler = CommandHandler
                .Create<FileInfo, string>(HandleRemoveStlCommand);

            var removeAnnotationCommand = new Command("annotation", "Add an annotation to an existing stl in a project file.")
            {
                new Option("--project", "Existing project file.")
                {
                    Required = true,
                    Argument = new Argument<FileInfo>().ExistingOnly()
                },
                new Option<string>("--stl-name", "Name of the stl to add the annotation to (Matches the name of the file, added to the project).")
                {
                    Required = true,
                },
                new Option<int>("--id", "ID of the annotation") { Required = true }
            };
            removeAnnotationCommand.Handler = CommandHandler
                .Create<FileInfo, string, int>(HandleRemoveAnnotationCommand);
            
            Command.Add(removeStlCommand);
            Command.Add(removeAnnotationCommand);
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

        private void HandleRemoveAnnotationCommand(FileInfo project, string stlName, int id)
        {
            var projectFile = ProjectFile.Load(project.FullName);
            var stl = projectFile.StlInfoList.SingleOrDefault(s => s.Name == stlName);
            
            if(stl != null)
            {
                var annotation = stl.AnnotationList.SingleOrDefault(a => a.Id == id);
                if(annotation != null)
                {
                    stl.AnnotationList.Remove(annotation);
                    projectFile.Save(project.FullName, true);
                    Console.WriteLine($"Removed annotation from project.");
                }
                else
                {
                    Console.WriteLine($"Annotation with ID {id} not found on STL '{stlName}'!");
                }
            }
            else
            {
                Console.WriteLine($"STL with name '{stlName}' not found in project!");
            }
        }

        public Command Command { get; } = new Command("remove", "Remove a stl or annotation from an existing project.");
    }
}