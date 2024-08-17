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
    public class WordPackDetailCreateResp
    {
        public int WordId { get; set; }
        public string Word { get; set; }
        public string Meaning { get; set; }
        public string Image { get; set; }
        public int Proficiency { get; set; }

    }
}
