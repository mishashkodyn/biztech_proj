namespace API.Core.Entities
{
    public class Message
    {
        public Guid Id { get; set; }
        public Guid? SenderId {  get; set; }
        public Guid? ReceiverId { get; set; }
        public string? Content { get; set; }
        public DateTime CreatedDate { get; set; }
        public bool IsRead { get; set; }
        public Message? ReplyMessage { get; set; }
        public Guid? ReplyMessageId { get; set; }
        public ApplicationUser? Sender { get; set; }
        public ApplicationUser? Receiver { get; set; }

    }
}
