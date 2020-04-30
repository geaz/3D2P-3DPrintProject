using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.IO;

namespace PrintProjects.ThreeMF.Tests
{
    [TestClass]
    public class Model3MFTests
    {
        [ClassInitialize]
        public static void ClearAndCreateExtractPath(TestContext testContext)
        {
            var extractPath = "TestData/extracted";
            if(Directory.Exists(extractPath))
                Directory.Delete(extractPath, true);
            Directory.CreateDirectory(extractPath);
        }

        [TestMethod]
        public void ShouldLoadModelsSuccessfully()
        {
            try
            {                
                // Act
                var model = new Model3MF("TestData/PlainMulti.3mf");
                model = new Model3MF("TestData/ReadmeMulti.3mf");
            }
            catch (Exception ex)
            {
                // Assert
                Assert.Fail("Expected no exception, but got: " + ex.Message);
            }
        }

        [TestMethod]
        public void ShouldGetMeshObjectsSuccessfully()
        {
            // Arrange
            var model = new Model3MF("TestData/ReadmeMulti.3mf");

            // Act
            var meshes = model.Meshes;

            // Assert
            Assert.AreEqual(11, meshes.Count);
        }

        [TestMethod]
        public void ShouldGetColorsSuccessfully()
        {
            // Arrange
            var model = new Model3MF("TestData/ReadmeMulti.3mf");

            // Act
            var colors = model.Colors;

            // Assert
            Assert.AreEqual(2, colors.Count);
        }

        [TestMethod]
        public void ShouldGetReadmeSuccessfully()
        {
            // Arrange
            var model = new Model3MF("TestData/ReadmeMulti.3mf");

            // Act
            var readme = model.Readme;

            // Assert
            Assert.IsFalse(string.IsNullOrEmpty(readme));
        }

        [TestMethod]
        public void ShouldExtractModelSuccesfully()
        {
            // Arrange
            var builder = new Model3MFBuilder();
            builder.AddStl("TestData/Test1.stl");
            builder.AddStl("TestData/Test2.stl");
            builder.Set3D2PFile("TestData/3D2P.json");
            builder.SetReadme("TestData/README.md");
            builder.Write3MF("TestData/Test.3mf", true);

            var model = new Model3MF("TestData/Test.3mf");

            // Act
            model.ExtractPrintProject("TestData/extracted");

            // Assert
            Assert.IsTrue(File.Exists("TestData/extracted/Test1.stl"), "Test1.stl not found!");
            Assert.IsTrue(File.Exists("TestData/extracted/Test2.stl"), "Test2.stl not found!");
            Assert.IsTrue(File.Exists("TestData/extracted/3D2P.json"), "3D2P.json not found!");
            Assert.IsTrue(File.Exists("TestData/extracted/README.md"), "README.md not found!");
            Assert.IsTrue(File.ReadAllBytes("TestData/extracted/Test1.stl").Length > 100);
        }
    }
}
