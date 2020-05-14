using NLog;
using System;

namespace PrintProject.App.CLI
{
    internal abstract class CliResultBase
    {
        protected readonly ILogger Logger = LogManager.GetLogger("ConsoleLogger");
        protected readonly ILogger ErrorLogger = LogManager.GetLogger("ErrorLogger");

        protected int ResultWrapper(Action commandFunction)
        {
            var result = 0;
            try
            {
                commandFunction();
            }
            catch(Exception ex)
            {
                result = 1;
                Logger.Error(ex.Message);
                ErrorLogger.Error(ex, ex.Message);
            }
            return result;
        }
    }
}