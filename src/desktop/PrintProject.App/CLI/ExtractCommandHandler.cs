using System.IO;
using System.CommandLine;
using PrintProject.ThreeMF;
using System.CommandLine.Invocation;

namespace PrintProject.App.CLI
{
    internal sealed class ExtractCommandHandler : CliResultBase
    {
        public ExtractCommandHandler()
        {
            BuildCommand();
        }

        private void BuildCommand()
        {
            var threeMfOption = new Option("--model", "The 3MF file to extract.")
            {
                Required = true,
                Argument = new Argument<FileInfo>().ExistingOnly()
            };
            var directoryOption = new Option("--dir", "New directory to output the content to.")
            {
                Required = true,
                Argument = new Argument<DirectoryInfo>()
            };

            Command.Add(threeMfOption);
            Command.Add(directoryOption);

            Command.Handler = CommandHandler
                .Create<FileInfo, DirectoryInfo>(HandleExtractCommand);
        }

        private int HandleExtractCommand(FileInfo model, DirectoryInfo dir)
        {
            return ResultWrapper(() =>
            {
                if(dir.Exists)
                {
                    Logger.Warn("Please use a new directory for the extraction!");
                }
                else
                {
                    dir.Create();
                    var model3mf = new Model3MF(model.FullName);
                    model3mf.ExtractPrintProject(dir.FullName);

                    Logger.Info($"Extracted successfully to '{dir.FullName}'");
                }
            });
        }

        public Command Command { get; } = new Command("extract", "Extract the content of a 3MF file (Created default 3D2P.json file, if non existent).");
    }
}