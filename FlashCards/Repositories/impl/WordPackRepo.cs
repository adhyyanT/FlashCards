using EFCore.BulkExtensions;
using FlashCards.Api.Core;
using FlashCards.Api.Core.Services;
using FlashCards.Api.Models;
using FlashCards.Database;
using FlashCards.Dtos.WordPackDtos;
using FlashCards.Models.Models;
using Microsoft.EntityFrameworkCore;
using MySql.Data.MySqlClient;

namespace FlashCards.Api.Repositories.impl
{

    public class WordPackRepo : IWordPackRepo
    {
        private readonly ApplicationDBContext _context;
        private readonly IAuthService _authService;


        public WordPackRepo(ApplicationDBContext context, IAuthService authService)
        {
            _context = context;
            _authService = authService;
        }

        public async Task<WordPack> CreateWordPackAsync(WordPackCreateRequest wordPackReq)
        {
            try
            {
                int appUserId = _authService.GetId();
                WordPack word = new()
                {
                    Name = wordPackReq.Name,
                    CreatedOn = DateTime.Now,
                    IsPublic = wordPackReq.IsPublic,
                    WordPackDetails = [],
                    AppUserId = appUserId
                };
                await _context.WordPacks.AddAsync(word);
                await _context.SaveChangesAsync();
                var wordDetails = wordPackReq.WordPackDetails.Select(d => new WordPackDetail
                {
                    CreatedOn = DateTime.Now,
                    Image = d.Image,
                    Meaning = d.Meaning,
                    Proficiency = 0,
                    Word = d.Word,
                    WordPackId = word.WordPackId
                }).ToList();
                var query = GenerateBulkInsertQuery(wordDetails, word.WordPackId);
                await _context.Database.ExecuteSqlRawAsync(query);

                word.WordPackDetails = await GetWordPackDetailsByPackIdAsync(word.WordPackId);
                return word;

            }
            catch(Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        public async Task<List<WordPack>> GetWordPacksByAppUserIdAsync()
        {
            try
            {
                var userId = _authService.GetId();
                var packs = await _context.WordPacks
                    .Where(p => p.AppUserId == userId).ToListAsync();
                return packs;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        public async Task<List<WordPackDetail>> GetWordPackDetailsByPackIdAsync(int wordPackId)
        {
            try
            {
                var wordPackDetails = await _context.WordPackDetails.Where(d => d.WordPackId == wordPackId).ToListAsync();
                return wordPackDetails;

            } catch(Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }


        private string GenerateBulkInsertQuery(List<WordPackDetail> wordDetails, int wordPackId)
        {
            var values = wordDetails.Select(d =>
            $"('{MySqlHelper.EscapeString(d.Word)}', '{MySqlHelper.EscapeString(d.Meaning)}', '{MySqlHelper.EscapeString(d.Image)}', {d.Proficiency}, {wordPackId}, '{DateTime.Now:yyyy-MM-dd HH:mm:ss}', '{DateTime.Now:yyyy-MM-dd HH:mm:ss}')"
    );

            return @$"INSERT INTO WordPackDetails 
               (Word, Meaning, Image, Proficiency, WordPackId, CreatedOn, UpdatedOn) 
               VALUES {string.Join(",", values)}";
        }

    }
}
