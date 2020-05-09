using System;
using System.IO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using PrintProject.ThreeMF;

namespace PrintProject.Web.Pages
{
    [IgnoreAntiforgeryToken(Order = 1001)]
    public class Index : PageModel
    {
        private readonly ILogger<Index> _logger;
        private readonly string _extractionPath = 
            Environment.GetEnvironmentVariable("PRINTPROJECT_EXTRACTION_TARGET_PATH");

        public Index(ILogger<Index> logger)
        {
            _logger = logger;
        }

        public IActionResult OnPost([FromBody]string base64DataUrl) 
        {
            var result = Content("");
            if(!string.IsNullOrEmpty(base64DataUrl))
            {
                var tempProjectFolder = Guid.NewGuid().ToString();
                var tempFolder = Path.Combine(_extractionPath, tempProjectFolder);
                Directory.CreateDirectory(tempFolder);

                var model3mf = Model3MF.FromBase64DataUrl(base64DataUrl);
                model3mf.ExtractPrintProject(tempFolder);

                result = Content(tempProjectFolder);
            }
            return result;
        }
    }
}
