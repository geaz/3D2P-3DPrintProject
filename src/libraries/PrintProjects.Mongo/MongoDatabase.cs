using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using PrintProjects.Core.Interfaces;
using PrintProjects.Core.Interfaces.Repositories;
using PrintProjects.Core.Model;
using PrintProjects.Mongo.Repositories;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;

namespace PrintProjects.Mongo
{
    sealed public class MongoDatabase : IDatabase
    {
        private MongoClient _client;
        private IMongoDatabase _database;

        public MongoDatabase(string connectionString, string databaseName)
        {
            _client = new MongoClient(connectionString);
            _database = _client.GetDatabase(databaseName);

            SetMappings();

            ProjectRepository = new ProjectRepository(this, _database.GetCollection<Project>("projects"));
        }

        public void AddTransaction(Func<Task> transaction)
        {
            var transactionList = new List<Func<Task>>(OpenTransactions);
            transactionList.Add(transaction);

            OpenTransactions = new ReadOnlyCollection<Func<Task>>(transactionList);
        }

        public async Task Commit()
        {
            using (var session = await _client.StartSessionAsync())
            {
                session.StartTransaction();
                await Task.WhenAll(OpenTransactions.Select(f => f()));
                await session.CommitTransactionAsync();

                OpenTransactions = new List<Func<Task>>().AsReadOnly();
            }
        }

        private void SetMappings()
        {
            BsonClassMap.RegisterClassMap<Project>(cm =>
            {
                cm.AutoMap();
            });
        }

        public ReadOnlyCollection<Func<Task>> OpenTransactions { get; private set; } = new List<Func<Task>>().AsReadOnly();

        public IProjectRepository ProjectRepository { get; }
    }
}
