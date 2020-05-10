using PrintProject.App.CLI;

namespace PrintProject.App
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
