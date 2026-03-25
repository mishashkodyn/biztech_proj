using API.Extentions;
using API.Infrastructure.Data;
using API.Services;
using API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.Hubs
{
    [Authorize]
    public class NotificationHub : Hub
    {
        private readonly INotificationService _notificationsService;

        public NotificationHub(INotificationService notificationsService)
        {
            _notificationsService = notificationsService;
        }

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var userId = httpContext.User.GetUserId();

            await Clients.Caller.SendAsync("Connected", $"Successfully connected to NotificationHub. User ID: {userId}");

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            await base.OnDisconnectedAsync(exception);
        }

        public async Task GetAllNotifications()
        {
            var httpContext = Context.GetHttpContext();
            var userId = httpContext.User.GetUserId();

            var notifications = await _notificationsService.GetNotificationsByUserIdAsync(userId);

            await Clients.Caller.SendAsync("ReceiveAllNotifications", notifications);
        }
    }
}
