using System.Threading.Tasks;
using PrintProjects.Core.Interfaces.Repositories;

namespace PrintProjects.Core.Interfaces
{
    public interface IDatabase
    {
        Task Commit();

        public IProjectRepository ProjectRepository { get; }
    }
}
