using API.Core.DTOs;
using API.Core.DTOs.Message;
using API.Core.Entities;
using API.Data;
using API.Extentions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Concurrent;

namespace API.Hubs
{
    [Authorize]
    public class ChatHub(UserManager<ApplicationUser> userManager, ApplicationDbContext context) : Hub
    {
        public static readonly ConcurrentDictionary<string, OnlineUserDto>

        onlineUsers = new();

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var receiverId = httpContext?.Request.Query["senderId"].ToString();
            var userName = Context.User!.Identity!.Name!;
            var currentUser = await userManager.FindByNameAsync(userName);
            var connectionId = Context.ConnectionId;

            if (onlineUsers.ContainsKey(userName))
            {
                onlineUsers[userName].ConnectionId = connectionId;
            } else
            {
                var user = new OnlineUserDto
                {
                    ConnectionId = connectionId,
                    UserName = userName,
                    ProfileImage = currentUser!.ProfileImage,
                    Name = currentUser.Name,
                    Surname = currentUser.Surname
                };

                onlineUsers.TryAdd(userName, user);

                await Clients.AllExcept(connectionId).SendAsync("Notify", currentUser);
            }

            if (!string.IsNullOrEmpty(receiverId))
            {
                await LoadMessages(Guid.Parse(receiverId));
            }

            await Clients.All.SendAsync("OnlineUsers", await GetAllUsers());
        }

        public async Task LoadMessages(Guid recipientId, int pageNumber = 1)
        {
            int pageSize = 10;
            var username = Context.User!.Identity!.Name;
            var currentUser = await userManager.FindByNameAsync(username!);

            if (currentUser == null)
            {
                return;
            }

            List<MessageResponseDto> messages = await context.Messages
                .Where(x => x.ReceiverId == currentUser!.Id && x.SenderId ==
                recipientId || x.SenderId == currentUser!.Id && x.ReceiverId == recipientId)
                .OrderByDescending(x => x.CreatedDate)
                .Skip((pageNumber-1)* pageSize)
                .Take(pageSize)
                .OrderBy(x => x.CreatedDate)
                .Select(x => new MessageResponseDto
                {
                    Id = x.Id,
                    Content = x.Content,
                    CreatedDate = x.CreatedDate,
                    ReceiverId = x.ReceiverId,
                    ReplyMessageId = x.ReplyMessageId ?? Guid.Empty,
                    ReplyMessageContent = x.ReplyMessage != null ? x.ReplyMessage.Content : "",
                    ReplyMessageSenderName = x.ReplyMessage != null && x.ReplyMessage.Sender != null
                                 ? x.ReplyMessage.Sender.Name
                                 : "",
                    SenderId = x.SenderId,
                    SenderName = x.Sender != null ? x.Sender.Name : ""
                })
                .ToListAsync();

            foreach (var message in messages)
            {
                var msg = await context.Messages.FirstOrDefaultAsync(x => x.Id == message.Id);

                if (msg != null && msg.ReceiverId == currentUser.Id)
                {
                    msg.IsRead = true;
                    await context.SaveChangesAsync();
                }
            }

            await Clients.User(currentUser.Id.ToString())
                .SendAsync("ReceiveMessageList", messages);

        }

        public async Task SendMessage(MessageRequestDto message)
        {

            var newMsg = new Message
            {
                SenderId = message.SenderId,
                ReceiverId = message.ReceiverId,
                IsRead = false,
                CreatedDate = DateTime.UtcNow,
                ReplyMessageId = message.ReplyMessageId,
                Content = message.Content
            };

            context.Messages.Add(newMsg);
            await context.SaveChangesAsync();

            await Clients.User(message.ReceiverId.ToString()!).SendAsync("ReceiveNewMessage", newMsg);
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var username = Context.User!.Identity!.Name;

            onlineUsers.TryRemove(username!, out _);

            await Clients.All.SendAsync("OnlineUsers", await GetAllUsers()); 
        }

        public async Task NotifyTyping(string recipientUserName)
        {
            var senderUserName = Context.User!.Identity!.Name;

            if (senderUserName is null)
            {
                return;
            }

            var connectionId = onlineUsers.Values.FirstOrDefault(x => x.UserName 
            == recipientUserName)?.ConnectionId;

            if (connectionId != null)
            {
                await Clients.Client(connectionId).SendAsync("NotifyTypingToUser",
                    senderUserName);
            }
        }
        private async Task<IEnumerable<OnlineUserDto>> GetAllUsers ()
        {
            var username = Context.User!.GetUserName();

            var onlineUsersSet = new HashSet<string>(onlineUsers.Keys);

            var users = await userManager.Users.Select(u => new OnlineUserDto
            {
                Id = u.Id,
                UserName = u.UserName,
                ProfileImage = u.ProfileImage,
                Name = u.Name,
                Surname = u.Surname,
                IsOnline = onlineUsersSet.Contains(u.UserName!),
                UnreadCount = context.Messages.Count(x => x.ReceiverId == u.Id && !x.IsRead)
            }).OrderByDescending(u => u.IsOnline)
            .ToListAsync();

            return users;
        }
    }
}
