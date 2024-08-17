using FlashCards.Api.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FlashCards.Dtos.WordPackDetailsDtos
{
    public class WordPackDetailCreateReq
    {
        [Required]
        public string Word { get; set; }
        [Required]
        public string Meaning { get; set; }
        public string Image { get; set; }
        public int Proficiency { get; set; } = 0;
    }
}
