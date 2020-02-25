using System;

namespace DatingApp.API.Dtos
{
    public class PhotoDetailsDto
    {
         public int Id { get; set; }
        public string Url{ get; set; }
        public string Description { get; set; }
        public DateTime DateAdded { get; set; }
        public Boolean isMain { get; set; }

    }
}