using API.Core.DTOs.BlobStorage;
using Azure.Storage.Blobs.Models;

namespace API.Services.Interfaces
{
    public interface IBlobStorageService
    {
        public Task<BlobInfoDto> GetBlobAsync(string blobName);
        public Task UploadFileBlobAsync(string filePath, string fileName);
        public Task DeleteBlobAsync(string blobName);
    }
}
