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
                name: "simplyRetro", 
                repositoryUrl: "https://github.com/geaz/simplyRetro-Z5.git",
                rawRepositoryUrl: null,
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
                name: "simplyRetro", 
                repositoryUrl: "https://github.com/geaz/simplyRetro-Z5.git",
                rawRepositoryUrl: "https://raw.githubusercontent.com/geaz/simplyRetro-Z5/master",
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
                name: "simplyRetro", 
                repositoryUrl: "https://github.com/geaz/simplyRetro-Z5.git",
                rawRepositoryUrl: "https://raw.githubusercontent.com/geaz/simplyRetro-Z5/master",
                downloadBasePath: downloadBasePath
            );

            //Assert
            Assert.IsFalse(string.IsNullOrEmpty(project.Name));
            Assert.IsFalse(string.IsNullOrEmpty(project.ShortId));
            Assert.IsTrue(Directory.Exists(project.DataPath));
            Assert.IsNotNull(project.CodeRepository);
        }
        
        [TestMethod]
        [ExpectedException(typeof(ModelException))]
        public void ShouldThrowExceptionOnNonExistingProjectFile()
        {
            //Arrange
            var downloadBasePath = Path.GetTempPath();
            var project = Project.Create
            (
                name: "3D2P - 3D Print Projects", 
                repositoryUrl: "https://github.com/geaz/3D2P-3DPrintProjects",
                rawRepositoryUrl: "https://raw.githubusercontent.com/geaz/3D2P-3DPrintProjects/master",
                downloadBasePath: downloadBasePath
            );

            //Act
            project.Update();

            //Assert
            //Exception thrown
        }
    }
}
