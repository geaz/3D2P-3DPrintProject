using System;
using System.IO;
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

        [HttpGet]
        [Route("RemoteExists")]
        public IActionResult RemoteExists(string repositoryUrl, string rawRepositoryUrl)
        {
            IActionResult result = Ok(false);
            try
            {
                var codeRepository = new CodeRepository(repositoryUrl, rawRepositoryUrl);
                if(codeRepository.RemoteFileExists(Project.PROJECT_FILE_NAME))
                {
                    result = Ok(true);
                }                
            }
            catch(Exception ex)
            {
                result = BadRequest(ex.Message);
            }
            return result;
        }

        [HttpPost]
        public async Task<IActionResult> CreateProject(string repositoryUrl, string rawRepositoryUrl)
        {
            IActionResult result = Ok();
            try
            {
                var project = await _database.ProjectRepository.GetByRepositoryUrl(repositoryUrl);
                if(project != null)
                {
                    result = BadRequest($"Project with repository url {repositoryUrl} already exists!");
                }
                else
                {
                    project = Project.Create
                    (
                        repositoryUrl: repositoryUrl,
                        rawRepositoryUrl: rawRepositoryUrl,
                        downloadBasePath: _settings.ProjectTargetPath
                    );
                    project.Update();

                    _database.ProjectRepository.Insert(project);
                    await _database.Commit();
                }   
            }
            catch(Exception ex)
            {
                result = BadRequest(ex.Message);
            }
            return result;
        }

        [HttpPut]
        public async Task<IActionResult> UpdateProject(string repositoryUrl)
        {
            IActionResult result = Ok();
            try
            {
                var project = await _database.ProjectRepository.GetByRepositoryUrl(repositoryUrl);
                if(project == null)
                {
                    result = BadRequest($"Project with repository url {repositoryUrl} doesn't exist!");
                }
                else if(project.CodeRepository.RemoteFileExists(Project.PROJECT_FILE_NAME))
                {
                    result = BadRequest($"Remote Repository doesn't contain a 3D2P.json file! Can't update the project!");
                }
                else
                {
                    project.Update();
                    _database.ProjectRepository.Update(project);
                    await _database.Commit();
                }
            }
            catch(Exception ex)
            {
                result = BadRequest(ex.Message);
            }
            return result;
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteProject(string repositoryUrl)
        {
            IActionResult result = Ok();
            try
            {
                var project = await _database.ProjectRepository.GetByRepositoryUrl(repositoryUrl);
                if(project == null)
                {
                    result = BadRequest($"Project with repository url {repositoryUrl} doesn't exist!");
                }
                else if(project.CodeRepository.RemoteFileExists(Project.PROJECT_FILE_NAME))
                {
                    result = BadRequest($"Remote Repository contains 3D2P.json file. Please remove it from the repository to delete the project!");
                }
                else
                {
                    Directory.Delete(project.DataPath, true);
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
