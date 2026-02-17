using API.Core.DTOs.AI;

namespace API.Services.Interfaces
{
    public interface IAiService
    {
        Task<string> ChatAsync(AiChatRequestDto request);
    }
}
