using System.Collections.ObjectModel;
using System.Threading.Tasks;

namespace PrintProjects.Core.Interfaces.Repositories
{
    public interface IRepository<T> where T : IEntity
    {
        Task<ReadOnlyCollection<T>> GetPaged(int page);

        void Insert(T entity);
        void Update(T entity);
        void Delete(T entity);
    }
}
