using System.Collections.ObjectModel;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using PrintProjects.Core.Interfaces;
using Model = PrintProjects.Core.Model;

namespace PrintProjects.Web.Pages
{
    public class IndexModel : PageModel
    {
        private static int PAGE_SIZE = 25;

        private readonly ILogger<IndexModel> _logger;
        private readonly IDatabase _database;

        public IndexModel(ILogger<IndexModel> logger, IDatabase database)
        {
            _logger = logger;
            _database = database;
        }

        public async Task<IActionResult> OnGet()
        {
            var result = (IActionResult) Page();
            if(CurrentPage > TotalPages)
            {
                result = RedirectToPage("/Error", new { code = "404" });
            }
            else
            {
                TotalPages = (await _database.ProjectRepository.Count()) / PAGE_SIZE;
                ProjectList = await _database.ProjectRepository
                    .GetPaged(CurrentPage != null ? CurrentPage.Value - 1 : 0, PAGE_SIZE);
            }
            return result;
        }

        [BindProperty(SupportsGet = true)]
        public int? CurrentPage { get; set; }
        
        public long TotalPages { get; private set; }
        public ReadOnlyCollection<Model.Project> ProjectList { get; private set; }
    }
}
