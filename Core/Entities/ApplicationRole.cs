using Microsoft.AspNetCore.Identity;

namespace API.Core.Entities
{
    public class ApplicationRole : IdentityRole<Guid>
    {
        public const string ROLE_SUPERADMIN = "Superadmin";
        public const string ROLE_ADMIN = "Admin";
        public const string ROLE_PSYCHOLOGIST = "Psychologist";
        public const string ROLE_USER = "User";
    }
}
