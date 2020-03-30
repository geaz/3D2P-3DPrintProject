using PrintProjects.Core.Model;
using System;
using System.Collections.ObjectModel;
using System.Diagnostics;
using System.Linq;

namespace PrintProjects.Core
{
    sealed public class GitClient
    {
        private readonly ProcessStartInfo _gitProcessInfo;

        public GitClient()
        {
            _gitProcessInfo = new ProcessStartInfo();
            _gitProcessInfo.CreateNoWindow = true;
            _gitProcessInfo.RedirectStandardError = true;
            _gitProcessInfo.RedirectStandardOutput = true;
            _gitProcessInfo.FileName = "git";
        }

        public void Clone(string targetPath, string repositoryUrl)
        {
            _gitProcessInfo.Arguments = $"clone {repositoryUrl} {targetPath}";
            _gitProcessInfo.WorkingDirectory = targetPath;

            var gitProcess = new Process();
            gitProcess.StartInfo = _gitProcessInfo;
            gitProcess.Start();

            //var stderr = gitProcess.StandardError.ReadToEnd();
            //var stdout = gitProcess.StandardOutput.ReadToEnd();

            gitProcess.WaitForExit();
            gitProcess.Close();
        }

        public void Pull(string repositoryPath)
        {
            _gitProcessInfo.Arguments = $"pull";
            _gitProcessInfo.WorkingDirectory = repositoryPath;

            var gitProcess = new Process();
            gitProcess.StartInfo = _gitProcessInfo;
            gitProcess.Start();

            //var stderr = gitProcess.StandardError.ReadToEnd();
            //var stdout = gitProcess.StandardOutput.ReadToEnd();

            gitProcess.WaitForExit();
            gitProcess.Close();
        }

        public DateTime GetLastCommitDate(string repositoryPath)
        {
            _gitProcessInfo.Arguments = $"log -1 --format=%cd --date=rfc";
            _gitProcessInfo.WorkingDirectory = repositoryPath;

            var gitProcess = new Process();
            gitProcess.StartInfo = _gitProcessInfo;
            gitProcess.Start();

            //var stderr = gitProcess.StandardError.ReadToEnd();
            var stdout = gitProcess.StandardOutput.ReadToEnd();

            gitProcess.WaitForExit();
            gitProcess.Close();

            return DateTime.Parse(stdout);
        }

        public ReadOnlyCollection<CommitInfo> GetLatestCommitInfos(string repositoryPath, int count)
        {
            _gitProcessInfo.Arguments = $"log -{count} --format=\"%s###%cd\" --date=rfc";
            _gitProcessInfo.WorkingDirectory = repositoryPath;

            var gitProcess = new Process();
            gitProcess.StartInfo = _gitProcessInfo;
            gitProcess.Start();

            //var stderr = gitProcess.StandardError.ReadToEnd();
            var stdout = gitProcess.StandardOutput.ReadToEnd();

            gitProcess.WaitForExit();
            gitProcess.Close();

            var commitInfos = stdout
                .Split('\n', StringSplitOptions.RemoveEmptyEntries)
                .Select(l =>
                {
                    var splitted = l.Split("###");
                    return new CommitInfo(splitted[0], DateTime.Parse(splitted[1]));
                })
                .ToList();
            return new ReadOnlyCollection<CommitInfo>(commitInfos);
        }
    }
}
