using FlashCards.Api.Models;
using FlashCards.Models.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FlashCards.Models.Models
{
    public class AppUser
    {
        [MaxLength(20)]
        public string FirstName { get; set; }
        [MaxLength(20)]
        public string LastName { get; set; }

        [Required]
        public byte[] Password { get; set; }
        [Required]
        public byte[] Salt { get; set; }

        [Key]
        public string Email { get; set; }
        public Gender Gender { get; set; }

        public int Age { get; set; }
        public string Avatar { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime UpdatedOn { get; set; } = DateTime.Now;

        public List<WordPack> WordPacks { get; set; } = [];
    }
}
