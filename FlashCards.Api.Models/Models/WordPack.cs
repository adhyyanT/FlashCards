using FlashCards.Models.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

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

        [ForeignKey(nameof(AppUser.AppUserId))]
        public int AppUserId { get; set; }
        public AppUser AppUser { get; set; }

        public override string ToString() 
        {
            return JsonSerializer.Serialize(new {WordPackId = this.WordPackId,Name = this.Name,IsPublic=this.IsPublic,AppUserId = this.AppUserId});
        }
    }
}
