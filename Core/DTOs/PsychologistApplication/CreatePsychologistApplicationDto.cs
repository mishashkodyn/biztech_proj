namespace API.Core.DTOs.PsychologistApplication
{
    public class CreatePsychologistApplicationDto
    {
        public string Phone { get; set; } = string.Empty;
        public string Education { get; set; } = string.Empty;
        public int ExperienceYears { get; set; }
        public List<string> Specializations { get; set; } = new();
        public List<IFormFile> Documents { get; set; } = new();
    }
}
