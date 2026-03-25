namespace API.Core.Entities
{
    public class Specialization
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set;}
        public ICollection<PsychologistApplication> Applications { get; set; } = new List<PsychologistApplication>();
        public ICollection<Psychologist> Psychologists { get; set; } = new List<Psychologist>();
    }
}
