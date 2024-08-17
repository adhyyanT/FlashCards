
using FlashCards.Api.Models;
using FlashCards.Dtos.WordPackDetailsDtos;
using FlashCards.Dtos.WordPackDtos;
using FlashCards.Models.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FlashCards.Dtos.Mappers
{
    public static class WordPackMapper
    {
        public static WordPackCreateResponse ToWordPackResponse(this WordPack wordPack)
        {
            return new WordPackCreateResponse
            {
                IsPublic = wordPack.IsPublic,
                Name = wordPack.Name,
                WordPackDetails = wordPack.WordPackDetails.Select(d => d.ToWordPackDetailResp()).ToList(),
                WordPackId = wordPack.WordPackId
            };
        }
        public static WordPackDetailCreateResp ToWordPackDetailResp(this WordPackDetail wordPackDetail)
        {
            return new WordPackDetailCreateResp
            {
                Image = wordPackDetail.Image,
                Meaning = wordPackDetail.Meaning,
                Proficiency = wordPackDetail.Proficiency,
                Word = wordPackDetail.Word,
                WordId = wordPackDetail.WordId
            };
        }
    }
}
