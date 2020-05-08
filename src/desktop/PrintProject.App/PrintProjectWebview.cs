using System;
using System.IO;
using SharpWebview;
using SharpWebview.Content;
using System.Threading;
using System.Reflection;
using PrintProject.ThreeMF;

namespace PrintProject.App
{
    internal sealed class PrintProjectWebview
    {
        private Webview _webview;
        private readonly string _extractionPath;

        public PrintProjectWebview()
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
                        @"window.printProject = {};
                        window.printProject.dropCallback = dropCallback;";
                    if(is3MF)
                    {
                        ClearCreateExtractionPath();
                        var model3mf = new Model3MF(model.FullName);
                        model3mf.ExtractPrintProject(_extractionPath);
                        initScript += "window.printProject.projectFolderUrl='/extracted';";
                    }

                    var hostedContent = new HostedContent();
                    using (_webview = new Webview(false, true))
                    {
                        _webview
                            .SetTitle("3D2P")
                            .SetSize(1024, 800, WebviewHint.None)
                            .SetSize(800, 800, WebviewHint.Min)
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

        private void ClearCreateExtractionPath() {
            if(Directory.Exists(_extractionPath)) Directory.Delete(_extractionPath, true);
            Directory.CreateDirectory(_extractionPath);
        }

        private void DropCallback(string id, string req)
        {
            var trimmedJsDataUrl = req.Trim(new char[]{ '[', ']', '"' });
            var basePos = trimmedJsDataUrl.IndexOf("base64,") + 7;
            trimmedJsDataUrl = trimmedJsDataUrl.Substring(basePos);

            ClearCreateExtractionPath();

            var modelFilePath = Path.Combine(_extractionPath, "model.3mf");
            File.WriteAllBytes(
                modelFilePath,
                Convert.FromBase64String(trimmedJsDataUrl));

            var model3mf = new Model3MF(modelFilePath);
            model3mf.ExtractPrintProject(_extractionPath);

            _webview.Return(id, RPCResult.Success, "{ projectFolderUrl: '/extracted' }");
        }
    }
}