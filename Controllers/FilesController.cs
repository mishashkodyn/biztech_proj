using API.Core.DTOs.BlobStorage;
using API.Core.Entities;
using API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/files")]
    [ApiController]
    public class FilesController : ControllerBase
    {
        private readonly IBlobStorageService _blobService;

        public FilesController(IBlobStorageService blobService)
        {
            _blobService = blobService;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadFiles([FromForm] List<IFormFile> files)
        {
            var uploadedUrls = new List<MessageAttachment>();

            foreach (var file in files)
            {
                if (file.Length > 0)
                {
                    var url = await _blobService.UploadFileAsync(file);

                    var type = file.ContentType.StartsWith("image") ? "image" :
                           file.ContentType.StartsWith("video") ? "video" : "file";

                    uploadedUrls.Add(new MessageAttachment
                    {
                        Path = url,
                        Type = type,
                        Name = file.FileName
                    });
                }

            }
            
            return Ok(uploadedUrls);
        }
    }
}
