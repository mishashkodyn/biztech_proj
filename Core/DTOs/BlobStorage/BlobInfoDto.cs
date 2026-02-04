namespace API.Core.DTOs.BlobStorage
{
    public class BlobInfoDto
    {
        public Stream Content { get; set; }
        public string ContentType { get; set; }

        public BlobInfoDto(Stream content, string contentType)
        {
            Content = content;
            ContentType = contentType;
        }
    }
}
