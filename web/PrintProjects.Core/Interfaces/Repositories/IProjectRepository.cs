using PrintProjects.Core.Model;
using System.Threading.Tasks;

namespace PrintProjects.Core.Interfaces.Repositories
{
    public interface IProjectRepository : IRepository<Project>
    {
        Task<Project> Get(string shortId);
    }
}