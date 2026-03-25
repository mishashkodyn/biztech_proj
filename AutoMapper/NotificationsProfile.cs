using API.Core.DTOs.Notifications;
using API.Core.Entities;
using AutoMapper;

namespace API.AutoMapper
{
    public class NotificationsProfile : Profile
    {
        public NotificationsProfile() 
        { 
            CreateMap<CreateNotificationDto, Notification>()
                .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title ?? ""))
                .ForMember(dest => dest.Message, opt => opt.MapFrom(src => src.Message ?? ""))
                .ForMember(dest => dest.IsRead, opt => opt.MapFrom(_ => false))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow))
                .ForMember(dest => dest.ReadAt, opt => opt.Ignore());

            CreateMap<Notification, NotificationDto>().ReverseMap();
        }
    }
}
