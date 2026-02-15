using API.Core.DTOs.BlobStorage;
using API.Core.Entities;

namespace API.Core.DTOs.Message
{
    public class MessageRequestDto
    {
        public Guid Id { get; set; }
        public Guid? SenderId { get; set; }
        public Guid? ReceiverId { get; set; }
        public string? SenderName { get; set; }
        public string? Content { get; set; }
        public bool IsRead { get; set; }
        public Guid? ReplyMessageId { get; set; }
        public string? ReplyMessageContent { get; set; }
        public string? ReplyMessageSenderName { get; set; }
        public DateTime CreatedDate { get; set; }
        public List<MessageAttachment>? Attachments { get; set; }
    }
}
