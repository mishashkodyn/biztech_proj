using API.Core.DTOs;
using API.Core.DTOs.PsychologistApplication;
using API.Core.Entities;
using AutoMapper;

namespace API.AutoMapper
{
    public class ApplicationMappingProfile : Profile
    {
        public ApplicationMappingProfile()
        {
            CreateMap<CreatePsychologistApplicationDto, PsychologistApplication>()
                .ForMember(dest => dest.DocumentUrls, opt => opt.Ignore())
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.UserId, opt => opt.Ignore())
                .ForMember(dest => dest.User, opt => opt.Ignore())
                .ForMember(dest => dest.Status, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.ReviewedAt, opt => opt.Ignore())
                .ForMember(dest => dest.ReviewedById, opt => opt.Ignore())
                .ForMember(dest => dest.Specializations, opt => opt.Ignore())
                .ForMember(dest => dest.ReviewedBy, opt => opt.Ignore());

            CreateMap<PsychologistApplication, PsychologistApplicationResponseDto>()
                .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.User.Name))
                .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.User.Surname))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.User.Email))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
                .ForMember(dest => dest.Specializations, opt => opt.MapFrom(src => src.Specializations));

            CreateMap<Specialization, SpecializationDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name));
        }
    }
}
