using System.IO;
using System.Linq;
using System.CommandLine;
using PrintProject.Core.Model;
using System.CommandLine.Invocation;

namespace PrintProject.App.CLI
{
    internal sealed class ListCommandHandler : CliResultBase
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

        private int HandleListStlsCommand(FileInfo project)
        {
            return ResultWrapper(() =>
            {
                var projectFile = ProjectFile.Load(project.FullName);
                Logger.Info($"Project at '{project.FullName}' includes the following STLs:");
                foreach(var stl in projectFile.StlInfoList)
                {
                    Logger.Info($"- {stl.Name} ({stl.Status}, {stl.Color}, Annotations: {stl.AnnotationList.Count})");
                }
            });
        }

        private int HandleListAnnotationsCommand(FileInfo project, string stlName)
        {
            return ResultWrapper(() =>
            {
                var projectFile = ProjectFile.Load(project.FullName);
                var stl = projectFile.StlInfoList.SingleOrDefault(s => s.Name == stlName);

                if(stl != null)
                {
                    foreach(var annotation in stl.AnnotationList)
                    {
                        Logger.Info($"- ID: {annotation.Id}, Text: {annotation.Text}");
                    }
                }
                else
                {
                    Logger.Warn($"STL with name '{stlName}' not found in project!");
                }
            });
        }

        public Command Command { get; } = new Command("list", "List stls and annotations in project file.");
    }
}