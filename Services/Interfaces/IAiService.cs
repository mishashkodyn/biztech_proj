namespace API.Services.Interfaces
{
    public interface IAiService
    {
        Task<string> ChatAsync(string message);
    }
}
