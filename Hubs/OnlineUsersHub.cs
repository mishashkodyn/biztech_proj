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
        private static readonly ConcurrentDictionary<string, HashSet<string>> OnlineUsers = new();
        public override async Task OnConnectedAsync()
        {
            var userName = Context.User!.Identity!.Name!;
            var connectionId = Context.ConnectionId;

            var userConnections = OnlineUsers.GetOrAdd(userName, _ => new HashSet<string>());

            bool isNewlyOnline;

            lock (userConnections)
            {
                isNewlyOnline = userConnections.Count == 0;
                userConnections.Add(connectionId);
            }

            var allUsersForCaller = await GetUsersWithStatusForUser(userName);
            await Clients.Caller.SendAsync("ReceiveAllUsers", allUsersForCaller);


            if (isNewlyOnline)
            {
                var currentUser = await userManager.FindByNameAsync(userName);
                if (currentUser != null)
                {
                    var notifyDto = CreateBasicUserDto(currentUser, true);
                    await Clients.Others.SendAsync("UserStatusChanged", notifyDto);

                    await Clients.Others.SendAsync("Notify", notifyDto);
                }
            }
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userName = Context.User!.Identity!.Name!;
            var connectionId = Context.ConnectionId;

            bool isFullyOffline = false;

            if (OnlineUsers.TryGetValue(userName, out var connections))
            {
                lock (connections)
                {
                    connections.Remove(connectionId);
                    if (connections.Count == 0)
                    {
                        isFullyOffline = true;
                        OnlineUsers.TryRemove(userName, out _);
                    }
                }
            }

            if (isFullyOffline)
            {
                var currentUser = await userManager.FindByNameAsync(userName);
                if (currentUser != null)
                {
                    var notifyDto = CreateBasicUserDto(currentUser, false);
                    await Clients.Others.SendAsync("UserStatusChanged", notifyDto);
                }
            }

            await base.OnDisconnectedAsync(exception);
        }

        private async Task<IEnumerable<UserDto>> GetUsersWithStatusForUser(string currentUserName)
        {
            var currentUser = await userManager.FindByNameAsync(currentUserName);
            if (currentUser == null) return new List<UserDto>();

            var currentUserId = currentUser.Id;
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
                    UnreadCount = context.Messages.Count(x => x.ReceiverId == currentUserId && x.SenderId == u.Id && !x.IsRead)
                })
                .OrderByDescending(u => u.IsOnline)
                .ThenBy(u => u.Name)
                .ToListAsync();
        }

        private static UserDto CreateBasicUserDto(ApplicationUser user, bool isOnline)
        {
            return new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                ProfileImage = user.ProfileImage,
                Name = user.Name,
                Surname = user.Surname,
                IsOnline = isOnline,
                UnreadCount = 0
            };
        }
    }
}
