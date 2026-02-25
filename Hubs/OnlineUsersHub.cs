using API.Core.DTOs;
using API.Core.Entities;
using API.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Concurrent;

namespace API.Hubs
{
    [Authorize]
    public class OnlineUsersHub(UserManager<ApplicationUser> userManager, ApplicationDbContext context) : Hub
    {
        public static readonly ConcurrentDictionary<string, UserDto>  OnlineUsers = new ();

        public override async Task OnConnectedAsync()
        {
            var userName = Context.User!.Identity!.Name!;
            var currentUser = await userManager.FindByNameAsync(userName);
            var connectionId = Context.ConnectionId;

            if (currentUser == null) return;

            var userDto = new UserDto
            {
                ConnectionId = connectionId,
                UserName = userName,
                ProfileImage = currentUser.ProfileImage,
                Name = currentUser.Name,
                Surname = currentUser.Surname,
                IsOnline = true
            };

            bool isNewlyAdded = OnlineUsers.TryAdd(userName, userDto);

            if (!isNewlyAdded)
            {
                OnlineUsers[userName].ConnectionId = connectionId;
            }

            if (isNewlyAdded)
            {
                await Clients.Others.SendAsync("Notify", currentUser);
            }

            await SendOnlineUsersToAll();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userName = Context.User!.Identity!.Name!;

            if (OnlineUsers.TryRemove(userName, out _))
            {
                await SendOnlineUsersToAll();
            }

            await base.OnDisconnectedAsync(exception);
        }

        private async Task SendOnlineUsersToAll()
        {
            var allUsers = await GetAllUsersWithStatus();
            await Clients.All.SendAsync("OnlineUsers", allUsers);
        }

        private async Task<IEnumerable<UserDto>> GetAllUsersWithStatus()
        {
            var currentUserName = Context.User?.Identity?.Name;
            var onlineUsersSet = new HashSet<string>(OnlineUsers.Keys);

            return await userManager.Users
                .Where(u => u.UserName != currentUserName)
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    UserName = u.UserName,
                    ProfileImage = u.ProfileImage,
                    Name = u.Name,
                    Surname = u.Surname,
                    IsOnline = onlineUsersSet.Contains(u.UserName!),
                    UnreadCount = context.Messages.Count(x => x.ReceiverId == u.Id && !x.IsRead)
                })
                .OrderByDescending(u => u.IsOnline)
                .ThenBy(u => u.Name)
                .ToListAsync();
        }
    }
}
