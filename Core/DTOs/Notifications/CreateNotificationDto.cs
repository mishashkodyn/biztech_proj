using API.Core.Entities;

namespace API.Core.DTOs.Notifications
{
    public class CreateNotificationDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string? Title { get; set; }
        public string? Message { get; set; }
        public NotificationType Type { get; set; }
        public Guid? RelatedEntityId { get; set; }
    }
}
