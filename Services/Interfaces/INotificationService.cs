using API.Core.DTOs.Notifications;

namespace API.Services.Interfaces
{
    public interface INotificationService
    {
        public Task SendNotificationAsync(CreateNotificationDto dto);
        public Task<IEnumerable<NotificationDto>> GetNotificationsByUserIdAsync(Guid userId, bool unreadOnly = false);
    }
}
