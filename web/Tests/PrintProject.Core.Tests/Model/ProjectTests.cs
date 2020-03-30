using Microsoft.VisualStudio.TestTools.UnitTesting;
using PrintProjects.Core.Model;
using System.IO;

namespace PrintProjects.Core.Tests.Model
{
    [TestClass]
    public class ProjectTests
    {
        [TestMethod]
        public void ShouldCloneProjectSuccessfully()
        {
            //Arrange
            var clonePath = Path.GetTempPath();
            var project = Project.Create
            (
                name: "simplyRetro", 
                repositoryUrl: "https://github.com/geaz/simplyRetro-Z5.git",
                repositoryBasePath: clonePath
            );

            //Act
            project.Update();

            //Assert
            Assert.IsNotNull(project.LastCommit);
            Assert.IsNotNull(project.LatestCommitInfos);
            Assert.IsTrue(Directory.Exists(project.RepositoryPath));
            Assert.IsFalse(string.IsNullOrEmpty(project.Readme));
            Assert.IsFalse(string.IsNullOrEmpty(project.License));
        }
    }
}
