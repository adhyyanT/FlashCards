using FlashCards.Models.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FlashCards.Api.Models
{
    public class WordPack
    {
        [Key]
        public int WordPackId { get; set; }

        [Required]
        public string Name { get; set; }

        public DateTime CreatedOn { get; set; }
        public DateTime UpdatedOn { get; set; } = DateTime.Now;
        public bool IsPublic { get; set; }


        public List<WordPackDetail> WordPackDetails { get; set; } = [];

        [ForeignKey(nameof(AppUser.Email))]
        public string AppUserEmail { get; set; }
        public AppUser AppUser { get; set; }


    }
}
