using System;
using System.IO;
using PrintProjects.Core.Model;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace PrintProjects.Core.Tests.Model
{
    [TestClass]
    public class ProjectTests
    {
        [TestMethod]
        [ExpectedException(typeof(ArgumentNullException))]
        public void ShouldThrowExceptionOnNullArguments()
        {
            //Act
            var project = Project.Create
            (
                repositoryUrl: "https://github.com/geaz/simplyRetro-Z5.git",
                downloadBasePath: null
            );

            //Assert
            //Exception thrown
        }
        
        [TestMethod]
        [ExpectedException(typeof(ModelException))]
        public void ShouldThrowExceptionOnNonExistingBasePath()
        {
            //Act
            var project = Project.Create
            (
                repositoryUrl: "https://github.com/geaz/simplyRetro-Z5.git",
                downloadBasePath: "C:\\NOTTHERE"
            );

            //Assert
            //Exception thrown
        }

        [TestMethod]
        public void ShouldCreateProjectSuccessfully()
        {
            //Arrange
            var downloadBasePath = Path.GetTempPath();

            //Act
            var project = Project.Create
            (
                repositoryUrl: "https://github.com/geaz/simplyRetro-Z5.git",
                downloadBasePath: downloadBasePath
            );

            //Assert
            Assert.IsFalse(string.IsNullOrEmpty(project.ShortId));
        }

        [TestMethod]
        public void ShouldUpdateProjectSuccessfully()
        {
            //Arrange
            var downloadBasePath = Path.GetTempPath();
            var project = Project.Create
            (
                repositoryUrl: "https://github.com/geaz/simplyRetro-Z5.git",
                downloadBasePath: downloadBasePath
            );

            //Act
            project.Update();

            //Assert
            Assert.IsTrue(Directory.Exists(project.RepositoryPath));
            Assert.IsTrue(Directory.GetFiles(project.RepositoryPath).Length > 0);
            Assert.IsFalse(string.IsNullOrEmpty(project.Readme));
        }
    }
}
