using System.Collections.ObjectModel;
using System.Threading.Tasks;

namespace PrintProjects.Core.Interfaces.Repositories
{
    public interface IRepository<T> where T : IEntity
    {
        Task<long> Count();
        Task<ReadOnlyCollection<T>> GetPaged(int page, int pageSize, string searchTerm);

        void Insert(T entity);
        void Update(T entity);
        void Delete(T entity);
    }
}
