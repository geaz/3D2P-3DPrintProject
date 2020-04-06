using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using PrintProjects.Core.Interfaces;
using PrintProjects.Core.Model;

namespace PrintProjects.Web.Api
{
    [ApiController]
    [Route("api/projects")]
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
        public async Task<IActionResult> UploadProject(string repositoryUrl)
        {
            IActionResult result = BadRequest();
            try
            {
                var project = await _database.ProjectRepository.GetByRepositoryUrl(repositoryUrl);
                if(project == null)
                {
                    project = Project.Create
                    (
                        repositoryUrl: repositoryUrl,
                        downloadBasePath: _settings.ProjectTargetPath
                    );
                    project.Update();
                    _database.ProjectRepository.Insert(project);
                }
                else
                {
                    project.Update();
                    _database.ProjectRepository.Update(project);
                }
                await _database.Commit();
                result = Ok(JsonConvert.SerializeObject(new { shortId = project.ShortId }));
            }
            catch(Exception ex)
            {
                result = BadRequest(ex.Message);
            }
            return result;
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteProject(string shortId)
        {
            IActionResult result = Ok();
            try
            {
                var project = await _database.ProjectRepository.GetByShortId(shortId);
                if(project == null)
                {
                    result = BadRequest($"Project with id '{shortId}' doesn't exist!");
                }
                else
                {
                    project.Delete();                    
                    _database.ProjectRepository.Delete(project);
                    await _database.Commit();                  
                }
            }
            catch(Exception ex)
            {
                result = BadRequest(ex.Message);
            }
            return result;
        }
    }
}
