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
    public class WordPackCreateResponse
    {
        
        public int WordPackId { get; set; }
        public string Name { get; set; }
        public bool IsPublic { get; set; }
        public List<WordPackDetailCreateResp> WordPackDetails { get; set; } = [];
    }
}
