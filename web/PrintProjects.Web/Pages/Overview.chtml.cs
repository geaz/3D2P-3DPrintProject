using System.Collections.ObjectModel;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using PrintProjects.Core.Interfaces;
using Model = PrintProjects.Core.Model;

namespace PrintProjects.Web.Pages
{
    public class Overview : PageModel
    {
        private static int PAGE_SIZE = 25;

        private readonly ILogger<Overview> _logger;
        private readonly IDatabase _database;

        public Overview(ILogger<Overview> logger, IDatabase database)
        {
            _logger = logger;
            _database = database;
        }

        public async Task<IActionResult> OnGet()
        {
            var result = (IActionResult) Page();
            var totalProjects = (await _database.ProjectRepository.Count());
            TotalPages =  totalProjects / PAGE_SIZE;
            TotalPages += totalProjects % PAGE_SIZE != 0 ? 1 : 0;

            if(CurrentPage > TotalPages || CurrentPage <= 0)
            {
                result = RedirectToPage("/Error", new { code = "404" });
            }
            else
            {
                ProjectList = await _database.ProjectRepository
                    .GetPaged(CurrentPage != null ? CurrentPage.Value - 1 : 0, PAGE_SIZE, SearchTerm);
            }        
            return result;
        }

        [BindProperty(SupportsGet = true)]
        public string SearchTerm { get; set; }

        [BindProperty(SupportsGet = true)]
        public int? CurrentPage { get; set; } = 1;
        
        public long TotalPages { get; private set; }
        public ReadOnlyCollection<Model.Project> ProjectList { get; private set; }
    }
}
