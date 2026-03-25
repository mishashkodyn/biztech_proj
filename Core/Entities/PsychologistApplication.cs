namespace API.Core.Entities
{
    public class PsychologistApplication
    {
        public Guid Id { get; set; }
        public ApplicationUser User { get; set; }
        public Guid UserId { get; set;}
        public string Phone { get; set; } = string.Empty;
        public string Education { get; set; } = string.Empty;
        public int ExperienceYears { get; set; }
        public ICollection<Specialization> Specializations { get; set; } = new List<Specialization>();
        public List<string> DocumentUrls { get; set; } = new();
        public ApplicationStatus Status { get; set; } = ApplicationStatus.Pending;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ReviewedAt { get; set; }
        public Guid? ReviewedById { get; set; }
        public ApplicationUser? ReviewedBy { get; set; }
    }

    public enum ApplicationStatus
    {
        Pending = 0,
        Approved = 1,
        Rejected = 2
    }
}
