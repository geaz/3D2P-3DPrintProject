using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PrintProjects.Core.Interfaces;
using PrintProjects.Core.Model;

namespace PrintProjects.Web.Api
{
    [ApiController]
    [Route("Projects")]
    public class ProjectController : ControllerBase
    {
        private readonly ILogger<ProjectController> _logger;
        private readonly Settings _settings;
        private readonly IDatabase _database;

        public ProjectController(ILogger<ProjectController> logger, Settings settings, IDatabase database)
        {
            _logger = logger;
            _settings = settings;
            _database = database;
        }

        [HttpPost]
        public async Task<ActionResult> CreateProject(string name, string repositoryUrl)
        {

            var project = Project.Create
            (
                name: name,
                repositoryUrl: repositoryUrl,
                repositoryBasePath: _settings.RepositoryTargetPath
            );
            project.Update();

            _database.ProjectRepository.Insert(project);
            await _database.Commit();

            return Ok();
        }
    }
}
