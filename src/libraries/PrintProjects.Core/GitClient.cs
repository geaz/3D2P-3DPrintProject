using System;
using System.Linq;
using System.Diagnostics;
using PrintProjects.Core.Model;
using System.Collections.ObjectModel;
using System.IO;

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
            ExecuteCommand();
        }

        public void Pull(string repositoryPath)
        {
            _gitProcessInfo.Arguments = $"pull";
            _gitProcessInfo.WorkingDirectory = repositoryPath;
            ExecuteCommand();  
        }

        public DateTime GetLastCommitDate(string repositoryPath)
        {
            _gitProcessInfo.Arguments = $"log -1 --format=%cd --date=rfc";
            _gitProcessInfo.WorkingDirectory = repositoryPath;
            return DateTime.Parse(ExecuteCommand());
        }

        public ReadOnlyCollection<CommitInfo> GetLatestCommitInfos(string repositoryPath, int count)
        {
            _gitProcessInfo.Arguments = $"log -{count} --format=\"%s###%cd\" --date=rfc";
            _gitProcessInfo.WorkingDirectory = repositoryPath;

            var commitInfos = ExecuteCommand()
                .Split('\n', StringSplitOptions.RemoveEmptyEntries)
                .Select(l =>
                {
                    var splitted = l.Split("###");
                    return new CommitInfo(splitted[0], DateTime.Parse(splitted[1]));
                })
                .ToList();
            return new ReadOnlyCollection<CommitInfo>(commitInfos);
        }

        /// <summary>
        /// Because of some 'read-only' flags on git files,
        /// error will be occure (Access Denied) on window systems.
        /// This method resets all file attributes prior to deleting it.
        /// </summary>
        public void DeleteGitFolder(string repositoryPath)
        {
            var files = Directory.GetFiles(repositoryPath);
            var directories = Directory.GetDirectories(repositoryPath);

            foreach (var file in files)
            {
                File.SetAttributes(file, FileAttributes.Normal);
                File.Delete(file);
            }

            foreach (var dir in directories)
            {
                DeleteGitFolder(dir);
            }

            File.SetAttributes(repositoryPath, FileAttributes.Normal);
            Directory.Delete(repositoryPath, false);
        }

        private string ExecuteCommand()
        {
            var gitProcess = new Process();
            gitProcess.StartInfo = _gitProcessInfo;
            gitProcess.Start();

            var stdout = gitProcess.StandardOutput.ReadToEnd();
            var stderr = gitProcess.StandardError.ReadToEnd();

            gitProcess.WaitForExit();
            var exitCode = gitProcess.ExitCode;
            gitProcess.Close();

            if(exitCode != 0)
            {
                throw new GitException(stderr);
            }
            return stdout;
        }
    }
}