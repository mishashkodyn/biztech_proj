using Amazon.S3;
using Amazon.S3.Model;
using API.Options;
using API.Services.Interfaces;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Options;

namespace API.Services
{
    public class R2StorageService : IStorageService
    {
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;
        private static readonly FileExtensionContentTypeProvider Provider = new FileExtensionContentTypeProvider();

        public R2StorageService(IOptions<CloudflareConfig> config)
        {
            var r2Config = config.Value;

            _bucketName = r2Config.BucketName;

            var s3Config = new AmazonS3Config
            {
                ServiceURL = r2Config.ServiceUrl,
            };

            _s3Client = new AmazonS3Client(
                r2Config.AccessKey,
                r2Config.SecretKey,
                s3Config);
        }

        public async Task<string> UploadFileAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                throw new ArgumentException("File is empty.");
            }

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";

            using var stream = file.OpenReadStream();

            var request = new PutObjectRequest
            {
                InputStream = stream,
                Key = fileName,
                BucketName = _bucketName,
                ContentType = GetContentType(file.FileName),
                DisablePayloadSigning = true
            };

            await _s3Client.PutObjectAsync(request);

            return $"https://pub-d7cf6e70a23a45a5b4bed41a645669d9.r2.dev/{fileName}";
        }

        public async Task DeleteFileAsync(string blobName)
        {
            if (string.IsNullOrEmpty(blobName))
                return;

            var request = new DeleteObjectRequest
            {
                BucketName = _bucketName,
                Key = blobName
            };

            await _s3Client.DeleteObjectAsync(request);
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
