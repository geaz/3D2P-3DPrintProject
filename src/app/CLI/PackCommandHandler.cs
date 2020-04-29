using System.IO;
using System.CommandLine;
using System.CommandLine.Invocation;
using PrintProjects.Core.Model;
using PrintProjects.ThreeMF;
using System;

namespace PrintProjects.App.CLI
{
    internal sealed class PackCommandHandler
    {
        public PackCommandHandler()
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
            var directoryOption = new Option("--dir", "Directory to output the new file to.")
            {
                Required = true,
                Argument = new Argument<DirectoryInfo>().ExistingOnly()
            };
            var overwriteOption = new Option<bool>("--overwrite", "Use to overwrite any exisiting 3D2P.json file in the target directory.");
            
            Command.Add(projectOption);
            Command.Add(directoryOption);
            Command.Add(overwriteOption);
            
            Command.Handler = CommandHandler
                .Create<FileInfo, DirectoryInfo, bool>(HandlePackCommand);
        }

        private void HandlePackCommand(FileInfo project, DirectoryInfo dir, bool overwrite)
        {
            var modelBuilder = new Model3MFBuilder();
            var projectFile = ProjectFile.Load(project.FullName);

            modelBuilder.Set3D2PFile(project.FullName);
            if(!string.IsNullOrEmpty(projectFile.Readme)) modelBuilder.SetReadme(projectFile.Readme);
            if(!string.IsNullOrEmpty(projectFile.Thumbnail)) modelBuilder.SetThumbnail(projectFile.Thumbnail);

            foreach(var stl in projectFile.StlInfoList)
            {
                modelBuilder.AddStl(stl.RelativePath);
            }
            
            var targetFilepath = Path.Combine(dir.FullName, $"{projectFile.Name}.3mf");
            Console.WriteLine($"Creating '{targetFilepath}' ...");
            modelBuilder.Write3MF(targetFilepath, overwrite);
        }

        public Command Command { get; } = new Command("pack", "Pack a project to a 3MF file.");
    }
}