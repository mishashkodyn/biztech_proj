using API.Core.DTOs.BlobStorage;
using API.Services.Interfaces;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.StaticFiles;

namespace API.Services
{
    public class BlobStorageService : IStorageService
    {
        private readonly BlobServiceClient _blobServiceClient;
        private static readonly FileExtensionContentTypeProvider Provider = new FileExtensionContentTypeProvider();
        private const string CONTAINER_NAME = "helphub";
        public BlobStorageService(BlobServiceClient blobServiceClient) 
        { 
            _blobServiceClient = blobServiceClient;
        }

        public async Task<string> UploadFileAsync(IFormFile file)
        {
            var containerClient = _blobServiceClient.GetBlobContainerClient(CONTAINER_NAME);

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var blobClient = containerClient.GetBlobClient(fileName);

            using var stream = file.OpenReadStream();
            await blobClient.UploadAsync(stream, new BlobHttpHeaders
            {
                ContentType = file.ContentType
            });

            return blobClient.Uri.ToString();
        }

        public async Task DeleteFileAsync(string blobName)
        {
            var conteinerClient = _blobServiceClient.GetBlobContainerClient(CONTAINER_NAME);

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
