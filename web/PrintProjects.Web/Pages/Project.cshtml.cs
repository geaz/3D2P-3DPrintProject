using Markdig;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PrintProjects.Core.Interfaces;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc.RazorPages;
using IO = System.IO;
using Model = PrintProjects.Core.Model;

namespace PrintProjects.Web.Pages
{
    public class ProjectModel : PageModel
    {
        private readonly ILogger<ProjectModel> _logger;
        private readonly IDatabase _database;

        public ProjectModel(ILogger<ProjectModel> logger, IDatabase database)
        {
            _logger = logger;
            _database = database;
        }

        public async Task<IActionResult> OnGet(string shortId)
        {
            var result = (IActionResult) RedirectToPage("/Error", new { code = "404" });
            
            Project = await _database.ProjectRepository.GetByShortId(shortId);
            if(Project != null)
            {
                ReadmeHtml = Markdown.ToHtml(Project.Readme);
                // Escape Backslashes and remove newlines
                // This way we are able to include the json into the html (see scryipt section in cshtml file)
                ProjectFileContent = IO.File
                    .ReadAllText(IO.Path.Combine(Project.DataPath, Model.Project.PROJECT_FILE_NAME))
                    .Replace("\\", "\\\\");
                ProjectFileContent = Regex.Replace(ProjectFileContent, @"\r\n?|\n", string.Empty);

                result = Page();
            }

            return result;
        }

        public Model.Project Project { get; private set; }
        public string ReadmeHtml { get; private set; }
        public string ProjectFileContent { get; private set; }
    }
}
