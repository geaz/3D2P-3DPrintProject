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
            var addStlCommand = new Command("stl", "Add a stl to an existing project file.")
            {
                new Option("--project", "Existing project file.")
                {
                    Required = true,
                    Argument = new Argument<FileInfo>().ExistingOnly()
                },
                new Option("--stl", "Path to stl file.")
                {
                    Required = true,
                    Argument = new Argument<FileInfo>().ExistingOnly()
                },
                new Option<string>("--color", getDefaultValue: () => "#F58026", description: "Color of the stl (#F58026)."),
                new Option<Status>("--status", getDefaultValue: () => Status.WIP, description: "Status of the stl (WIP, Done).")
            };
            addStlCommand.Handler = CommandHandler
                .Create<FileInfo, FileInfo, string, Status>(HandleAddStlCommand);

            var addAnnotationCommand = new Command("annotation", "Add an annotation to an existing stl in a project file.")
            {
                new Option("--project", "Existing project file.")
                {
                    Required = true,
                    Argument = new Argument<FileInfo>().ExistingOnly()
                },
                new Option<string>("--stl-name", "Name of the stl to add the annotation to (Matches the name of the file, added to the project).")
                {
                    Required = true
                },
                new Option<string>("--text", "Text of the annotation") { Required = true },
                new Option<decimal>("--x", "The X coordinate of the annotation on the STL.") { Required = true },
                new Option<decimal>("--y", "The Y coordinate of the annotation on the STL.") { Required = true },
                new Option<decimal>("--z", "The Z coordinate of the annotation on the STL.") { Required = true },
            };
            addAnnotationCommand.Handler = CommandHandler
                .Create<FileInfo, string, string, decimal, decimal, decimal>(HandleAddAnnotationCommand);

            Command.Add(addStlCommand);
            Command.Add(addAnnotationCommand);
        }

        private void HandleAddStlCommand(FileInfo project, FileInfo stl, string color, Status status)
        {
            var projectFile = ProjectFile.Load(project.FullName);
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

        private void HandleAddAnnotationCommand(FileInfo project, string stlName, string text, decimal x, decimal y, decimal z)
        {
            var projectFile = ProjectFile.Load(project.FullName);
            var stl = projectFile.StlInfoList.SingleOrDefault(s => s.Name == stlName);

            if(stl != null)
            {
                var annotationIds = stl.AnnotationList.Select(a => a.Id);
                var annotation = new StlAnnotation()
                {
                    Id = annotationIds.Any() ? annotationIds.Max() + 1 : 0,
                    Text = text,
                    X = x,
                    Y = y,
                    Z = z
                };
                stl.AnnotationList.Add(annotation);
                projectFile.Save(project.FullName, true);

                Console.WriteLine($"Added annotation with ID {annotation.Id} to stl.");
            }
            else
            {
                Console.WriteLine($"STL with name '{stlName}' not found in project!");
            }
        }

        public Command Command { get; } = new Command("add", "Add a stl or annotation to an existing project.");
    }
}