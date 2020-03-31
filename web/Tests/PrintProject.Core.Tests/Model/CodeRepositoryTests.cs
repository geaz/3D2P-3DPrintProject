using System.IO;
using System.Net;
using PrintProjects.Core.Model;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace PrintProjects.Core.Tests.Model
{
    [TestClass]
    public class CodeRepositoryTests
    {
        [TestMethod]
        public void ShouldCheckRemoteFileSuccessfully()
        {
            //Arrange
            var codeRepository = new CodeRepository(
                repositoryUrl: "https://github.com/geaz/3D2P-3DPrintProjects",
                rawRepositoryUrl: "https://raw.githubusercontent.com/geaz/3D2P-3DPrintProjects/master/"
            );

            //Act
            var result = codeRepository.RemoteFileExists(Project.PROJECT_FILE_NAME);

            //Assert
            Assert.IsFalse(result);
        }

        [TestMethod]
        [ExpectedException(typeof(ModelException))]
        public void ShouldThrowExceptionOnNonAbsoluteRawUrl()
        {
            //Act
            var codeRepository = new CodeRepository(
                repositoryUrl: "https://github.com/geaz/3D2P-3DPrintProjects",
                rawRepositoryUrl: "https://raw.githubusercontent.com/geaz/3D2P-3DPrintProjects/master"
            );

            //Assert
            //Exception thrown
        }

        [TestMethod]
        [ExpectedException(typeof(WebException))]
        public void ShouldThrowExceptionOnNonExistingProjectFile()
        {
            //Arrange
            var downloadBasePath = Path.GetTempPath();
            var codeRepository = new CodeRepository(
                repositoryUrl: "https://github.com/geaz/3D2P-3DPrintProjects",
                rawRepositoryUrl: "https://raw.githubusercontent.com/geaz/3D2P-3DPrintProjects/master/"
            );

            //Act
            codeRepository.DownloadProjectFile(downloadBasePath);

            //Assert
            //Exception thrown
        }

        [TestMethod]
        public void ShouldDownloadProjectFileSuccessfully()
        {
            //Arrange
            var downloadBasePath = Path.GetTempPath();
            var codeRepository = new CodeRepository(
                repositoryUrl: "https://github.com/geaz/simplyRetro-Z5.git",
                rawRepositoryUrl: "https://raw.githubusercontent.com/geaz/simplyRetro-Z5/master/"
            );

            //Act
            var projectFile = codeRepository.DownloadProjectFile(downloadBasePath);

            //Assert
            Assert.IsTrue(File.Exists(Path.Combine(downloadBasePath, Project.PROJECT_FILE_NAME)));
            Assert.IsFalse(string.IsNullOrEmpty(projectFile.Name));
            Assert.IsFalse(string.IsNullOrEmpty(projectFile.Status));
            Assert.IsNotNull(projectFile.StlInfoList);
            Assert.IsNotNull(projectFile.GalleryInfoList);
        }
    }
}
