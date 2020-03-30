using System;

namespace PrintProjects.Web
{
    sealed public class Settings
    {
        public string RepositoryTargetPath { get; set; }
        public string Database { get; set; }

        private string _connectionString;
        public string ConnectionString
        {
            get => _connectionString;
            set
            {
                _connectionString = string.Format(value, Environment.GetEnvironmentVariable("MONGOAUTH"));
            }
        }
    }
}
