using System;
using System.ComponentModel.DataAnnotations;

namespace DatingApp.API.Dtos
{
    public class UserForRegisterDtos
    {
        [Required]
        public string Username { get; set; }
        [Required]
        [StringLength(8, MinimumLength = 4, ErrorMessage = "You must specify password between 4 and 8")]
        public string Password { get; set; }
 [Required]
        public string Gender  { get; set; }

         [Required]
        public string knownAs { get; set; }

         [Required]
        public DateTime DateOfBirth { get; set; }

         [Required]
        public string City { get; set; }

         [Required]
        public string Country { get; set; }

        public DateTime Created { get; set; }

        public DateTime  LastAcitve { get; set; }
        public UserForRegisterDtos() {
            Created = DateTime.Now;
            LastAcitve = DateTime.Now;
        }
    }
    
}