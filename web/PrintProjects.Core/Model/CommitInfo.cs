using System;

namespace PrintProjects.Core.Model
{
    public class CommitInfo
    {
        public CommitInfo(string message, DateTime commitDate)
        {
            Message = message;
            CommitDate = commitDate;
        }

        public string Message { get; private set; }
        public DateTime CommitDate { get; private set; }
    }
}
