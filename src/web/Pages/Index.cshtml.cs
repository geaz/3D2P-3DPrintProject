using System.Collections.ObjectModel;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using PrintProjects.Core.Interfaces;
using Model = PrintProjects.Core.Model;

namespace PrintProjects.Web.Pages
{
    public class Index : PageModel
    {
        private static int PAGE_SIZE = 8;

        private readonly ILogger<Index> _logger;
        private readonly IDatabase _database;

        public Index(ILogger<Index> logger, IDatabase database)
        {
            _logger = logger;
            _database = database;
        }

        public async Task<IActionResult> OnGet()
        {
            var result = (IActionResult) Page();
            var totalProjects = (await _database.ProjectRepository.Count());

            ProjectList = await _database.ProjectRepository.GetPaged(0, PAGE_SIZE);      
            return result;
        }
        
        public ReadOnlyCollection<Model.Project> ProjectList { get; private set; }
    }
}
