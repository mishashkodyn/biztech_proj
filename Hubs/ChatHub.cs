using API.Core.DTOs;
using API.Core.DTOs.Message;
using API.Core.Entities;
using API.Extentions;
using API.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Concurrent;

namespace API.Hubs
{
    public class ChatHub(UserManager<ApplicationUser> userManager, ApplicationDbContext context) : Hub
    {
        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var receiverId = httpContext?.Request.Query["senderId"].ToString();

            if (!string.IsNullOrEmpty(receiverId))
            {
                await LoadMessages(Guid.Parse(receiverId));
            }

            await base.OnConnectedAsync();
        }

        public async Task LoadMessages(Guid recipientId, int pageNumber = 1)
        {
            int pageSize = 10;
            var username = Context.User!.Identity!.Name;
            var currentUser = await userManager.FindByNameAsync(username!);

            if (currentUser == null) return;

            var messages = await context.Messages
                .Where(x => (x.ReceiverId == currentUser.Id && x.SenderId == recipientId) ||
                            (x.SenderId == currentUser.Id && x.ReceiverId == recipientId))
                .OrderByDescending(x => x.CreatedDate)
                .Skip((pageNumber - 1) * pageSize)
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
                        ? x.ReplyMessage.Sender.Name : "",
                    SenderId = x.SenderId,
                    IsRead = x.IsRead,
                    SenderName = x.Sender != null ? x.Sender.Name : "",
                    Attachments = x.Attachments ?? new List<MessageAttachment>()
                })
                .ToListAsync();

            var unreadMessages = await context.Messages
                .Where(x => x.ReceiverId == currentUser.Id && x.SenderId == recipientId && !x.IsRead)
                .ToListAsync();

            if (unreadMessages.Any())
            {
                unreadMessages.ForEach(m => m.IsRead = true);
                await context.SaveChangesAsync();
            }

            await Clients.Caller.SendAsync("ReceiveMessageList", messages);
        }

        public async Task SendMessage(MessageRequestDto message)
        {
            var newId = Guid.NewGuid();

            var newMsg = new Message
            {
                Id = newId,
                SenderId = message.SenderId,
                ReceiverId = message.ReceiverId,
                IsRead = false, 
                CreatedDate = DateTime.UtcNow,
                ReplyMessageId = message.ReplyMessageId,
                Content = message.Content,
                Attachments = message.Attachments?.Select(a => new MessageAttachment
                {
                    MessageId = newId,
                    Path = a.Path ?? "",
                    Type = a.Type,
                    Name = a.Name ?? ""
                }).ToList()
            };

            context.Messages.Add(newMsg);
            await context.SaveChangesAsync();
            await Clients.User(message.ReceiverId.ToString()!).SendAsync("ReceiveNewMessage", newMsg);
            await Clients.Caller.SendAsync("ReceiveNewMessage", newMsg);
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            await base.OnDisconnectedAsync(exception);
        }

        public async Task NotifyTyping(string recipientUserName)
        {
            var senderUserName = Context.User!.Identity!.Name;
            if (string.IsNullOrEmpty(senderUserName)) return;

            await Clients.User(recipientUserName).SendAsync("NotifyTypingToUser", senderUserName);
        }
    }
}
