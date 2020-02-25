using System.Linq;
using DatingApp.API.Dtos;
using DatingApp.API.Models;
using AutoMapper;

namespace DatingApp.API.Helpers
{
    //AutoMapper est un outil permettant de définir une stratégie de mapping objet-objet.
    public class AutoMapperProfiles: Profile
    {
        public AutoMapperProfiles()
        {
            //configurer l’association des propriétés d’un objet source vers un objet destination
            CreateMap<User, UserForListDto>()
            .ForMember(dest => dest.photoUrl, opt =>opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.isMain).Url))
            .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()));
            CreateMap<User, UserForDetailedDto>()
             .ForMember(dest => dest.photoUrl, opt =>opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.isMain).Url))
            .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()));
            CreateMap<Photo, PhotoDetailsDto>();
        }
    }
} 