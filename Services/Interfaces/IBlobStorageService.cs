using API.Core.DTOs.BlobStorage;
using Azure.Storage.Blobs.Models;

namespace API.Services.Interfaces
{
    public interface IBlobStorageService
    {
        public Task<BlobInfoDto> GetBlobAsync(string blobName);
        public Task<string> UploadFileAsync(IFormFile file);
        public Task DeleteBlobAsync(string blobName);
    }
}
