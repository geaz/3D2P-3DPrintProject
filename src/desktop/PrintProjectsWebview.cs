using System;
using System.IO;
using SharpWebview;
using SharpWebview.Content;
using System.Threading;
using System.Reflection;
using PrintProjects.ThreeMF;

namespace PrintProjects.App
{
    internal sealed class PrintProjectsWebview
    {
        private Webview _webview;
        private readonly string _extractionPath;

        public PrintProjectsWebview()
        {
            var basePath = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
            _extractionPath = Path.Combine(basePath, "app", "extracted");
        }

        public void Run(FileInfo model)
        {
            var is3MF = model?.Extension.ToUpper() == ".3MF";
            if(model == null || is3MF)
            {
                // System.CommandLine parses and executes the CLI arguments
                // in a new Task. Because of this, it is necessary to execute
                // a new STA Thread to run the webview. Will throw exceptions otherwise.
                Thread thread = new Thread(() =>
                {
                    var initScript =
                        @"window.printProjects = {};
                        window.printProjects.dropCallback = dropCallback;";
                    if(is3MF)
                    {
                        var model3mf = new Model3MF(model.FullName);
                        model3mf.ExtractPrintProject(_extractionPath);
                        initScript += "window.printProjects.projectFolderUrl='/extracted';";
                    }

                    var hostedContent = new HostedContent();
                    using (_webview = new Webview(false, true))
                    {
                        _webview
                            .SetTitle("3D2P")
                            .SetSize(1280, 960, WebviewHint.None)
                            .SetSize(1024, 768, WebviewHint.Min)
                            .Bind("dropCallback", DropCallback)
                            .InitScript(initScript)
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

        private void DropCallback(string id, string req)
        {
            if(Directory.Exists(_extractionPath)) Directory.Delete(_extractionPath, true);
            Directory.CreateDirectory(_extractionPath);

            var modelFilePath = Path.Combine(_extractionPath, "model.3mf");
            var trimmedJsDataUrl = req
                    .Trim(new char[]{ '[', ']', '"' })
                    .Remove(0, "data:;base64,".Length);

            File.WriteAllBytes(
                modelFilePath,
                Convert.FromBase64String(trimmedJsDataUrl));

            var model3mf = new Model3MF(modelFilePath);
            model3mf.ExtractPrintProject(_extractionPath);

            _webview.Return(id, RPCResult.Success, "{ projectFolderUrl: '/extracted' }");
        }
    }
}