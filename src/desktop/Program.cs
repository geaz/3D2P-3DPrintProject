using PrintProjects.App.CLI;

namespace PrintProjects.App
{
    internal static class Program
    {
        private static int Main(string[] args)
        {
            var rootCommandHandler = new RootCommandHandler();
            return rootCommandHandler.Execute(args);
        }
    }
}
