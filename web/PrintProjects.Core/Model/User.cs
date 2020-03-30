using PrintProjects.Core.Interfaces;
using System;

namespace PrintProjects.Core.Model
{
    public class User : IEntity
    {
        private User() { }

        public static User Create(string username, string password)
        {
            return new User
            {
                Username = username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password)
            };
        }

        public static User Load(Guid id, string username, string passwordHash)
        {
            return new User
            {
                Id = id,
                Username = username,
                PasswordHash = passwordHash
            };
        }

        public bool IsPasswordValid(string password)
        {
            return BCrypt.Net.BCrypt.Verify(password, PasswordHash);
        }

        public Guid Id { get; private set; } = Guid.NewGuid();
        public string Username { get; private set; }
        public string PasswordHash { get; private set; }
    }
}
