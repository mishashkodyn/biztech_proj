namespace API.Core.Entities
{
    public class MessageAttachment
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid MessageId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Path { get; set; } = string.Empty;
        public string? Type { get; set; }
    }
}
