using System;
using System.IO;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace PrintProjects.Core.Tests
{
    [TestClass]
    public class GitClientTests
    {
        [TestMethod]
        public void ShouldCloneSuccessfully()
        {
            //Arrange
            var clonePath = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString());
            Directory.CreateDirectory(clonePath);

            var gitClient = new GitClient();

            //Act
            gitClient.Clone(clonePath, "https://github.com/geaz/simplyRetro-Z5.git");

            //Assert
            Assert.IsTrue(File.Exists(Path.Combine(clonePath, "README.md")));
        }

        [TestMethod]
        public void ShouldDeleteSuccessfully()
        {
            //Arrange
            var clonePath = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString());
            Directory.CreateDirectory(clonePath);

            var gitClient = new GitClient();
            gitClient.Clone(clonePath, "https://github.com/geaz/simplyRetro-Z5.git");

            //Act
            gitClient.DeleteGitFolder(clonePath);

            //Assert
            // NO EXCEPTION THROWN
        }
    }
}
