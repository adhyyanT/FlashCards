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

        public int AppUserId { get; set; }
        public string FirstName { get; set; }

        public string LastName { get; set; }
        
        public string Email { get; set; }
        public Gender Gender { get; set; }

        public int Age { get; set; }
        public string Avatar { get; set; }
        public string Jwt { get; set; }
    }
}
