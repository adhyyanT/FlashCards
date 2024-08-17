using FlashCards.Models.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FlashCards.Dtos.WordPackDetailsDtos;

namespace FlashCards.Dtos.WordPackDtos
{
    public class WordPackCreateRequest
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public bool IsPublic { get; set; }

        public List<WordPackDetailCreateReq> WordPackDetails { get; set; } = [];
    }
}
