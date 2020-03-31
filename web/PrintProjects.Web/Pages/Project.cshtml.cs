using System.Threading.Tasks;
using Markdig;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using PrintProjects.Core.Interfaces;
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
                result = Page();
            }

            return result;
        }

        public Model.Project Project { get; private set; }

        public string ReadmeHtml { get; private set; }
    }
}
