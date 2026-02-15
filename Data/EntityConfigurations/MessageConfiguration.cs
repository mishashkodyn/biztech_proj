using API.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace API.Data.EntityConfigurations
{
    public class MessageConfiguration : IEntityTypeConfiguration<Message>
    {
        public void Configure(EntityTypeBuilder<Message> builder)
        {
            builder.HasKey(m => m.Id);

            builder
                .HasOne(m => m.ReplyMessage)
                .WithMany()
                .HasForeignKey(m => m.ReplyMessageId)
                .OnDelete(DeleteBehavior.NoAction);

            builder
                .HasOne(s => s.Sender)
                .WithMany()
                .HasForeignKey(m => m.SenderId);

            builder
                .HasOne(s => s.Receiver)
                .WithMany()
                .HasForeignKey(m => m.ReceiverId);
        }
    }
}
