using System;
using System.IO;
using System.CommandLine;
using System.CommandLine.Invocation;
using SharpWebview.Content;
using SharpWebview;
using System.Threading;

namespace PrintProjects.App.CLI
{
    internal sealed class RootCommandHandler
    {
        private readonly AddCommandHandler _addCommand = new AddCommandHandler();
        private readonly SetCommandHandler _setCommand = new SetCommandHandler();
        private readonly ListCommandHandler _listCommand = new ListCommandHandler();
        private readonly PackCommandHandler _packCommand = new PackCommandHandler();
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
            RootCommand.Handler = CommandHandler.Create<FileInfo>(HandleRootCommand);
        }

        private void HandleRootCommand(FileInfo model)
        {
            if(model == null || model.Extension.ToUpper() == ".3MF")
            {
                // System.CommandLine parses and executes the CLI arguments
                // in a new Task. Because of this, it is necessary to execute
                // a new STA Thread to run the webview. Will throw exceptions otherwise.
                Thread thread = new Thread(() =>
                {
                    var hostedContent = new HostedContent();
                    using (var webview = new Webview(true))
                    {
                        webview
                            .SetTitle("3D2P")              
                            .SetSize(1024, 768, WebviewHint.None)
                            .SetSize(1024, 768, WebviewHint.Min)
                            .Navigate(hostedContent)
                            .Run();
                    }
                });
                thread.SetApartmentState(ApartmentState.STA);
                thread.Start();
                thread.Join();
            }
            else
            {
                Console.WriteLine("This is a 3MF viewer. Please provide a '.3mf' file! Or use '-h' for help.");
            }
        }

        public RootCommand RootCommand { get; } = new RootCommand("3D Print Projects - 3MF Viewer and Packager");
    }
}