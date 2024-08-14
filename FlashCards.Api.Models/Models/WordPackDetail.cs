using FlashCards.Api.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FlashCards.Models.Models
{
    public class WordPackDetail
    {
        [Key]
        public int WordId { get; set; }
        public string Word { get; set; }
        public string Meaning { get; set; }
        public string Image { get; set; }
        public int Proficiency { get; set; } = 0;

        public DateTime CreatedOn { get; set; }
        public DateTime UpdatedOn { get; set; } = DateTime.Now;

        [ForeignKey(nameof(WordPack.WordPackId))]
        public int WordPackId { get; set; }

        public WordPack WordPack { get; set; }

    }
}
