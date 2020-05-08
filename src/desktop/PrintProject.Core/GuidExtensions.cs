using System;

namespace PrintProject.Core
{
    internal static class GuidExtensions
    {
        public static string GetShortGuid(this Guid guid)
        {
            return Convert
                .ToBase64String(guid.ToByteArray())
                .Replace("/", "3D")
                .Replace("+", "2P")
                .Substring(0, 22)
                .ToUpper();
        }
    }
}
