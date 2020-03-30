using MongoDB.Driver;
using PrintProjects.Core.Interfaces.Repositories;
using PrintProjects.Core.Model;
using System.Threading.Tasks;

namespace PrintProjects.Mongo.Repositories
{
    sealed public class ProjectRepository : BaseRepository<Project>, IProjectRepository
    {
        public ProjectRepository(MongoDatabase database, IMongoCollection<Project> collection)
            : base(database, collection) { }

        public async Task<Project> Get(string shortId)
        {
            return await _collection.Find(f => f.ShortId == shortId).FirstOrDefaultAsync();
        }
    }
}
