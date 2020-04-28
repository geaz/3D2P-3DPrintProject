using System;
using System.IO;
using System.Linq;
using SharpWebview;
using SharpWebview.Content;
using PrintProjects.ThreeMF;

namespace PrintProjects.App
{
    class Program
    {
        [STAThread]
        static void Main(string[] args)
        {
            var openApp = true;
            var filePath = args.FirstOrDefault();
            if(filePath != null && File.Exists(filePath))
            {
                if(Path
                    .GetFileName(filePath)
                    .ToUpper() == "3D2P.JSON")
                {
                    openApp = false;
                    // Pack 3MF
                }
                else if(Path
                    .GetExtension(filePath)
                    .ToUpper() == "3MF")
                {
                    var model = new Model3MF(filePath);
                }
            }

            if(openApp)
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
            }             
        }
    }
}
