using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using PrintProjects.Core.Interfaces;
using Model = PrintProjects.Core.Model;

namespace PrintProjects.Web.Pages
{
    public class IndexModel : PageModel
    {
        private readonly ILogger<IndexModel> _logger;
        private readonly IDatabase _database;

        public IndexModel(ILogger<IndexModel> logger, IDatabase database)
        {
            _logger = logger;
            _database = database;
        }

        public async Task OnGet()
        {
            ProjectList = await _database.ProjectRepository.GetPaged(0);
        }

        public ReadOnlyCollection<Model.Project> ProjectList { get; private set; }
    }
}
