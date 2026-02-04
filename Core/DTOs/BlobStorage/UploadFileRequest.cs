namespace API.Core.DTOs.BlobStorage
{
    public class UploadFileRequest
    {
        public string? FilePath { get; set; }
        public string? FileName { get; set; }
    }
}
