using API.Core.DTOs.BlobStorage;
using Azure.Storage.Blobs.Models;

namespace API.Services.Interfaces
{
    public interface IStorageService
    {
        public Task<string> UploadFileAsync(IFormFile file);
        public Task DeleteFileAsync(string blobName);
    }
}
