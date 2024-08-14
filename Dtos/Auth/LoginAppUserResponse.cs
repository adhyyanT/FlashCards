using FlashCards.Models.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FlashCards.Dtos.Auth
{
    public class LoginAppUserResponse
    {
        [MaxLength(20)]
        public string FirstName { get; set; }
        [MaxLength(20)]
        public string LastName { get; set; }
        
        [Key]
        public string Email { get; set; }
        public Gender Gender { get; set; }

        public int Age { get; set; }
        public string Avatar { get; set; }
        public string Jwt { get; set; }
    }
}
