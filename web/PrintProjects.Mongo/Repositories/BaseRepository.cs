using MongoDB.Driver;
using PrintProjects.Core.Interfaces;
using PrintProjects.Core.Interfaces.Repositories;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;

namespace PrintProjects.Mongo.Repositories
{
    public abstract class BaseRepository<T> : IRepository<T> where T : IEntity 
    {
        protected readonly MongoDatabase _database;
        protected readonly IMongoCollection<T> _collection;

        public BaseRepository(MongoDatabase database, IMongoCollection<T> collection)
        {
            _database = database;
            _collection = collection;
        }

        public async Task<ReadOnlyCollection<T>> GetPaged(int page)
        {
            var result = await _collection.Find(x => true)
                    .Skip(page * 50)
                    .Limit(50)
                    .ToListAsync();
            return new ReadOnlyCollection<T>(result.Cast<T>().ToList());
        }

        public void Insert(T data)
        {
            _database.AddTransaction(() => _collection.InsertOneAsync(data));
        }

        public void Update(T data)
        {
            _database.AddTransaction(() => _collection.ReplaceOneAsync(Builders<T>.Filter.Eq("_id", data.Id), data));
        }

        public void Delete(T data)
        {
            _database.AddTransaction(() => _collection.DeleteOneAsync(Builders<T>.Filter.Eq("_id", data.Id)));
        }
    }
}
