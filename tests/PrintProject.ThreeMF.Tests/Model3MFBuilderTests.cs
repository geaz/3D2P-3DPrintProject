using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace PrintProject.ThreeMF.Tests
{
    [TestClass]
    public class Model3MFBuilderTests
    { 
        [TestMethod]
        public void ShouldAddStlsSuccessfully()
        {
            // Arrange
            var builder = new Model3MFBuilder();

            // Act
            builder.AddStl("TestData/Test1.stl");
            builder.AddStl("TestData/Test2.stl");
            builder.Write3MF("TestData/Test.3mf", true);

            // Assert
            var model = new Model3MF("TestData/Test.3mf");
            Assert.AreEqual(2, model.Meshes.Count);
        }

        [TestMethod]
        public void ShouldSetReadmeSuccessfully()
        {
            // Arrange
            var builder = new Model3MFBuilder();

            // Act
            builder.SetReadme("TestData/README.md");
            builder.Write3MF("TestData/Test.3mf", true);

            // Assert
            var model = new Model3MF("TestData/Test.3mf");
            Assert.IsFalse(string.IsNullOrEmpty(model.Readme));
        }

        [TestMethod]
        public void ShouldSetAttachmentSuccessfully()
        {
            // Arrange
            var builder = new Model3MFBuilder();

            // Act
            builder.Set3D2PFile("TestData/3D2P.json");
            builder.Write3MF("TestData/Test.3mf", true);

            // Assert
            var model = new Model3MF("TestData/Test.3mf");
            Assert.IsTrue(model.GetAttachment("/Metadata/3D2P.json") != null);
        }
    }
}
