using System.Linq;
using MongoDB.Driver;
using System.Threading.Tasks;
using PrintProjects.Core.Model;
using System.Collections.ObjectModel;
using PrintProjects.Core.Interfaces.Repositories;

namespace PrintProjects.Mongo.Repositories
{
    sealed public class ProjectRepository : BaseRepository<Project>, IProjectRepository
    {
        public ProjectRepository(MongoDatabase database, IMongoCollection<Project> collection)
            : base(database, collection) { }

        public async Task<Project> GetByRepositoryUrl(string repositoryUrl)
        {
            return await _collection.Find(f => f.CodeRepository.RepositoryUrl == repositoryUrl).FirstOrDefaultAsync();
        }

        public async Task<Project> GetByShortId(string shortId)
        {
            return await _collection.Find(f => f.ShortId == shortId).FirstOrDefaultAsync();
        }

        public override async Task<ReadOnlyCollection<Project>> GetPaged(int page, int pageSize, string searchText = null)
        {
            var filter = string.IsNullOrEmpty(searchText)
                ? Builders<Project>.Filter.Empty
                : Builders<Project>.Filter.Text(searchText);
            var result = await _collection.Find(filter)
                    .Limit(pageSize)
                    .Skip(page * pageSize)
                    .SortByDescending(p => p.LastUpdate)
                    .ToListAsync();
            return new ReadOnlyCollection<Project>(result.ToList());
        }
    }
}
