using API.Core.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace API.Infrastructure.Identity
{
    public static class DbInitializer
    {
        public static async Task SeedRolesAndAdminAsync(IServiceProvider serviceProvider, IConfiguration configuration)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<ApplicationRole>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();

            string[] roleNames = {
                ApplicationRole.ROLE_SUPERADMIN,
                ApplicationRole.ROLE_ADMIN,
                ApplicationRole.ROLE_PSYCHOLOGIST,
                ApplicationRole.ROLE_USER
            };

            foreach (var roleName in roleNames)
            {
                var roleExist = await roleManager.RoleExistsAsync(roleName);
                if (!roleExist)
                {
                    await roleManager.CreateAsync(new ApplicationRole { Name = roleName });
                }
            }

            var adminSettings = configuration.GetSection("HeadAdmin");
            var adminEmail = adminSettings["Email"];

            if (string.IsNullOrEmpty(adminEmail)) return;

            var headAdmin = await userManager.FindByEmailAsync(adminEmail);

            if (headAdmin == null)
            {
                var newAdmin = new ApplicationUser
                {
                    Name = adminSettings["Name"],
                    Surname = adminSettings["Surname"],
                    UserName = adminSettings["UserName"],
                    Email = adminEmail,
                    ProfileImage = adminSettings["ProfileImage"],
                    EmailConfirmed = true
                };

                var adminPassword = adminSettings["Password"] ?? "DefaultPassword123!";
                var createPowerUser = await userManager.CreateAsync(newAdmin, adminPassword);

                if (createPowerUser.Succeeded)
                {
                    await userManager.AddToRolesAsync(newAdmin, roleNames);
                }
            }
        }
    }
}