using System;
using PrintProjects.App.CLI;

namespace PrintProjects.App
{
    class Program
    {
        static int Main(string[] args)
        {
            var rootCommandHandler = new RootCommandHandler();
            return rootCommandHandler.Execute(args);          
        }
    }
}
