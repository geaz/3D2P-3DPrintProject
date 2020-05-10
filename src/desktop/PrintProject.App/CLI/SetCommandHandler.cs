using System;
using System.IO;
using System.CommandLine;
using PrintProject.Core.Model;
using System.CommandLine.Invocation;
using System.Linq;
using Newtonsoft.Json;

namespace PrintProject.App.CLI
{
    internal sealed class SetCommandHandler
    {
        public SetCommandHandler()
        {
            BuildCommand();
        }

        private void BuildCommand()
        {
            var setProjectCommand = new Command("project", "Set project values.")
            {
                new Option<FileInfo>("--project", "Path to project to change.") { Required = true },
                new Option<string>("--name", "Set the project name."),
                new Option<Status?>("--status", "Set the project status."),
                new Option<FileInfo>("--thumbnail", "Set the thumbnail path."),
                new Option<FileInfo>("--readme", "Set the readme path.")
            };
            setProjectCommand.Handler = CommandHandler
                .Create<FileInfo, string, Status?, FileInfo, FileInfo>(HandleSetProjectCommand);

            var setStlCommand = new Command("stl", "Set stl values.")
            {
                new Option<FileInfo>("--project", "Path to project to change.") { Required = true },
                new Option<string>("--stl-name", "Name of the stl to set the values (Matches the name of the file, added to the project).")
                {
                    Required = true
                },
                new Option<string>("--color", description: "Color of the stl (#F58026)."),
                new Option<Status?>("--status", description: "Status of the stl (WIP, Done).")
            };
            setStlCommand.Handler = CommandHandler
                .Create<FileInfo, string, string, Status?>(HandleSetStlCommand);

            var setAnnotationsCommand = new Command("annotations", "Set annotations of a STL.")
            {
                new Option<FileInfo>("--project", "Path to project to change.") { Required = true },
                new Option<string>("--stl-name", "Name of the stl to set the values (Matches the name of the file, added to the project).")
                {
                    Required = true
                },
                new Option<string>("--annotations", description: "[{id: Number, text: String, x: Number, y: Number, z: Number }]")
            };
            setAnnotationsCommand.Handler = CommandHandler
                .Create<FileInfo, string, string>(HandleSetAnnotationsCommand);

            Command.Add(setProjectCommand);
            Command.Add(setStlCommand);
            Command.Add(setAnnotationsCommand);
        }

        private void HandleSetProjectCommand(FileInfo project, string name, Status? status, FileInfo thumbnail, FileInfo readme)
        {
            var projectFile = ProjectFile.Load(project.FullName);
            projectFile.Name = !string.IsNullOrEmpty(name) ? name : projectFile.Name;
            projectFile.Status = status ?? projectFile.Status;
            projectFile.Thumbnail = thumbnail != null ? Path.GetRelativePath(project.DirectoryName, thumbnail.FullName) : projectFile.Thumbnail;
            projectFile.Readme = readme != null ? Path.GetRelativePath(project.DirectoryName, readme.FullName) : projectFile.Readme;
            projectFile.Save(project.FullName, true);
            Console.WriteLine("Project values set.");
        }

        private void HandleSetStlCommand(FileInfo project, string stlName, string color, Status? status)
        {
            var projectFile = ProjectFile.Load(project.FullName);
            var stl = projectFile.StlInfoList.SingleOrDefault(s => s.Name == stlName);

            if(stl != null)
            {
                stl.Color = color ?? stl.Color;
                stl.Status = status ?? stl.Status;
                projectFile.Save(project.FullName, true);
                Console.WriteLine("STL values set.");
            }
            else
            {
                Console.WriteLine($"STL with name '{stlName}' not found in project!");
            }
        }

        private void HandleSetAnnotationsCommand(FileInfo project, string stlName, string annotations)
        {
            var projectFile = ProjectFile.Load(project.FullName);
            var stl = projectFile.StlInfoList.SingleOrDefault(s => s.Name == stlName);

            if(stl != null)
            {
                stl.AnnotationList = JsonConvert.DeserializeObject<StlAnnotation[]>(annotations).ToList();
                projectFile.Save(project.FullName, true);
                Console.WriteLine("STL Annotations set.");
            }
            else
            {
                Console.WriteLine($"STL with name '{stlName}' not found in project!");
            }
        }

        public Command Command { get; } = new Command("set", "Set properties of an existing project or stl.");
    }
}