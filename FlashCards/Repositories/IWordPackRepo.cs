using FlashCards.Api.Core;
using FlashCards.Api.Models;
using FlashCards.Dtos.WordPackDtos;
using FlashCards.Models.Models;

namespace FlashCards.Api.Repositories
{
    public interface IWordPackRepo
    {
        public Task<WordPack> CreateWordPackAsync(WordPackCreateRequest wordPack);
        public Task<WordPack> CloneWordPackAsync(int wordPackId);
        public Task<List<WordPack>> GetWordPacksByAppUserIdAsync();
        public Task<WordPack> GetWordPackById(int wordPackId);
        public Task<List<WordPack>> GetPublicWordPacksAsync();
        public Task<List<WordPackDetail>> GetWordPackDetailsByPackIdAsync(int wordPackId);
    }
}
