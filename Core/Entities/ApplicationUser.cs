using Microsoft.AspNetCore.Identity;

namespace API.Core.Entities
{
    public class ApplicationUser : IdentityUser<Guid>
    {
        public string? Name { get; set; }
        public string? Surname { get; set; }
        public string? ProfileImage { get; set; }

    }
}
