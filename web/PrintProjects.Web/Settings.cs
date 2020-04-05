using System;

namespace PrintProjects.Web
{
    sealed public class Settings
    {
        public string Database { get; set; }
        public string ProjectTargetPath => Environment.GetEnvironmentVariable("_3D2P_PROJECT_TARGET_PATH");

        private string _connectionString;
        public string ConnectionString
        {
            get => _connectionString;
            set
            {
                _connectionString = string.Format(value, Environment.GetEnvironmentVariable("_3D2P_MONGOAUTH"));
            }
        }
    }
}
