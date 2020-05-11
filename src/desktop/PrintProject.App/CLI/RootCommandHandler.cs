using System.IO;
using System.CommandLine;
using System.CommandLine.Invocation;

namespace PrintProject.App.CLI
{
    internal sealed class RootCommandHandler
    {
        private readonly AddCommandHandler _addCommand = new AddCommandHandler();
        private readonly SetCommandHandler _setCommand = new SetCommandHandler();
        private readonly ListCommandHandler _listCommand = new ListCommandHandler();
        private readonly PackCommandHandler _packCommand = new PackCommandHandler();
        private readonly ExtractCommandHandler _extractCommand = new ExtractCommandHandler();
        private readonly CreateCommandHandler _createCommand = new CreateCommandHandler();
        private readonly RemoveCommandHandler _removeCommand = new RemoveCommandHandler();

        public RootCommandHandler()
        {
            BuildCommand();
        }

        public int Execute(string[] args)
        {
            return RootCommand.Invoke(args);
        }

        private void BuildCommand()
        {
            var fileArgument =
                new Argument<FileInfo>()
                {
                    Name = "Model",
                    Description = "3MF file to open",
                    Arity = ArgumentArity.ZeroOrOne
                }.ExistingOnly();

            RootCommand.AddArgument(fileArgument);
            RootCommand.Add(_createCommand.Command);
            RootCommand.Add(_addCommand.Command);
            RootCommand.Add(_listCommand.Command);
            RootCommand.Add(_setCommand.Command);
            RootCommand.Add(_removeCommand.Command);
            RootCommand.Add(_packCommand.Command);
            RootCommand.Add(_extractCommand.Command);
            RootCommand.Handler = CommandHandler.Create<FileInfo>((model) => new PrintProjectWebview().Run(model));
        }

        public RootCommand RootCommand { get; } = new RootCommand("3D Print Project - 3MF Viewer and Packager");
    }
}