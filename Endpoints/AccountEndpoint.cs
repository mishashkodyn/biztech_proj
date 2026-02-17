using API.Common;
using API.Core.DTOs;
using API.Core.Entities;
using API.Extentions;
using API.Services;
using API.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;

namespace API.Endpoints
{
    public static class AccountEndpoint
    {
        public static RouteGroupBuilder MapAccountEndpoint(this WebApplication app)
        {
            var group = app.MapGroup("api/account").WithTags("account");

            group.MapPost("/register", async (HttpContext context, UserManager<ApplicationUser>
             userManager, [FromForm] string name, [FromForm] string surname, [FromForm] string email,
             [FromForm] string password, [FromForm] string username, [FromForm] IFormFile? profileImage, IBlobStorageService blobService) =>
            {
                var userFromDb = await userManager.FindByEmailAsync(email);

                if (userFromDb is not null)
                {
                    return Results.BadRequest(Response<string>.Failure("User is alreade exist."));
                }

                if (profileImage is null)
                {
                    return Results.BadRequest(Response<string>.Failure("Profile image is required"));
                }

                string pictureUrl = await blobService.UploadFileAsync(profileImage);

                var user = new ApplicationUser
                {
                    Name = name,
                    Surname = surname,
                    Email = email,
                    UserName = username,
                    ProfileImage = pictureUrl
                };

                var result = await userManager.CreateAsync(user, password);

                if (!result.Succeeded)
                {
                    await blobService.DeleteBlobAsync(user.ProfileImage);
                    return Results.BadRequest(Response<string>.Failure(result.Errors
                        .Select(x => x.Description).FirstOrDefault()!));
                }

                return Results.Ok(Response<string>.Success("", "User create successfully."));
            }).DisableAntiforgery();

            group.MapPost("/login", async (UserManager<ApplicationUser> userManager,
            TokenService tokenService, LoginDto dto) =>
            {
                if (dto is null)
                {
                    return Results.BadRequest(Response<string>.Failure("Invalid login details."));
                }

                var user = await userManager.FindByEmailAsync(dto.Email);

                if (user is null)
                {
                    return Results.BadRequest(Response<string>.Failure("User not found."));
                }

                var result = await userManager.CheckPasswordAsync(user!, dto.Password);

                if (!result)
                {
                    return Results.BadRequest(Response<string>.Failure("Invalid password."));
                }

                var token = tokenService.GenerateToken(user.Id, user.UserName!);

                return Results.Ok(Response<string>.Success(token, "Login successfully"));
            });

            group.MapGet("/me", async (HttpContext context, UserManager<ApplicationUser> userManager) =>
            {
                var currentLoggedInUserId = context.User.GetUserId()!;

                var currentLoggedInUser = await userManager.Users.SingleOrDefaultAsync(x => x.Id == currentLoggedInUserId);

                return Results.Ok(Response<ApplicationUser>.Success(currentLoggedInUser!, "User fetched successfully."));
            }).RequireAuthorization();

            group.MapGet("/AIprovider", async (HttpContext context, UserManager<ApplicationUser> userManager) =>
            {
                var currentLoggedInUserId = context.User.GetUserId()!;

                var currentLoggedInUser = await userManager.Users.SingleOrDefaultAsync(x => x.Id == currentLoggedInUserId);

                var response = new UserDto
                {
                    Name = currentLoggedInUser!.Name,
                    Surname = currentLoggedInUser.Surname,
                    PreferredAiProvider = currentLoggedInUser.PreferredAiProvider
                };

                return Results.Ok(Response<UserDto>.Success(response!, "User fetched successfully."));
            }).RequireAuthorization();

            return group;
        }
    }
}
