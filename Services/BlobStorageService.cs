using API.Core.DTOs.BlobStorage;
using API.Services.Interfaces;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.StaticFiles;

namespace API.Services
{
    public class BlobStorageService : IBlobStorageService
    {
        private readonly BlobServiceClient _blobServiceClient;
        private readonly string _containerName;
        private static readonly FileExtensionContentTypeProvider Provider = new FileExtensionContentTypeProvider();

        public BlobStorageService(BlobServiceClient blobServiceClient, IConfiguration configuration) 
        { 
            _blobServiceClient = blobServiceClient;
            _containerName = configuration["BlobStorage:BlobContainerName"] ?? "helphub";
        }

        public async Task<BlobInfoDto> GetBlobAsync(string blobName) 
        {
            var conteinerClient = _blobServiceClient.GetBlobContainerClient(_containerName);

            var blobClient = conteinerClient.GetBlobClient(blobName);

            var blobDownloadInfo = await blobClient.DownloadAsync();

            return new BlobInfoDto(blobDownloadInfo.Value.Content, blobDownloadInfo.Value.ContentType);
        }

        public async Task UploadFileBlobAsync(string filePath, string fileName)
        {
            var conteinerClient = _blobServiceClient.GetBlobContainerClient(_containerName);

            var blobClient = conteinerClient.GetBlobClient(fileName);

            await blobClient.UploadAsync(filePath, new BlobHttpHeaders {ContentType = GetContentType(filePath)});
        }

        public async Task DeleteBlobAsync(string blobName)
        {
            var conteinerClient = _blobServiceClient.GetBlobContainerClient(_containerName);

            var blobClient = conteinerClient.GetBlobClient(blobName);

            await blobClient.DeleteIfExistsAsync();
        }

        public static string GetContentType(string fileName)
        {
            if (!Provider.TryGetContentType(fileName, out var contentType))
            {
                contentType = "application/octet-stream";
            }

            return contentType;
        }
    }
}
