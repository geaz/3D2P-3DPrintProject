using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;

namespace PrintProjects.ThreeMF.Tests
{
    [TestClass]
    public class Model3MFTests
    {
        [TestMethod]
        public void ShouldLoadModelSuccessfully()
        {
            try
            {                
                // Act
                var model = new Model3MF("TestData/ReadmeMulti.3mf");
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
    }
}
