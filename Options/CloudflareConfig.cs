namespace API.Options
{
    public class CloudflareConfig
    {
        public bool Enabled { get; set; }
        public string AccessKey { get; set; }
        public string SecretKey { get; set; }
        public string ServiceUrl { get; set; }
        public string BucketName { get; set; }
    }
}
