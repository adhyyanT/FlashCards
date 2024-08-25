using FlashCards.Models.Enums;
using System.ComponentModel.DataAnnotations;


namespace Dtos.Auth
{
    public class RegisterUserRequest
    {
        [MaxLength(20)]
        [Required]
        public string FirstName { get; set; }

        [MaxLength(20)]
        [Required]
        public string LastName { get; set; }

        [MaxLength(20)]
        [Required]
        public string Password { get; set; }

        [MaxLength(20)]
        [Required]
        public string ConfirmPassword { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public Gender Gender { get; set; }

        [Required]
        public int Age { get; set; }
        public string Avatar { get; set; }
    }
}
