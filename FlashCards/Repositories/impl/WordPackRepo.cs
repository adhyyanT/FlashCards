using EFCore.BulkExtensions;
using FlashCards.Api.Core;
using FlashCards.Api.Core.Services;
using FlashCards.Api.Models;
using FlashCards.Database;
using FlashCards.Dtos.WordPackDetailsDtos;
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
                    AppUserId = appUserId,
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
                var createdWordPack = await GetWordPackById(word.WordPackId);
                
                return createdWordPack;

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
                    .Include((p) => p.AppUser)
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
                var wordPackDetails = await _context.WordPackDetails
                    .Where(d => d.WordPackId == wordPackId).ToListAsync();
                return wordPackDetails;

            } catch(Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        public async Task<List<WordPack>> GetPublicWordPacksAsync()
        {
            try
            {
                var wordPacks = await _context.WordPacks
                    .Include((p)=>p.AppUser)
                    .Where(p => p.IsPublic).ToListAsync();
                return wordPacks;
            }
            catch (Exception e)
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

        public async Task<WordPack> CloneWordPackAsync(int wordPackId)
        {
            try
            {
                var wordPack = await GetWordPackById(wordPackId);

                if (!wordPack.IsPublic) throw new Exception("Cannot clone this word pack");
                var nWordPack = new WordPack
                {
                    WordPackDetails = [],
                    IsPublic = false,
                    Name = wordPack.Name,
                    AppUserId = _authService.GetId(),
                    CreatedOn = DateTime.Now,
                };

                await _context.WordPacks.AddAsync(nWordPack);
                await _context.SaveChangesAsync();
                var bulkQuery = GenerateBulkInsertQuery(wordPack.WordPackDetails, nWordPack.WordPackId);
                await _context.Database.ExecuteSqlRawAsync(bulkQuery);
                Console.WriteLine(nWordPack.ToString());
                return nWordPack;
            } catch(Exception e)
            {
                Console.WriteLine("_______________________");
                Console.WriteLine(e);
                throw;
            }
        }
        public async Task<WordPack> GetWordPackById(int wordPackId)
        {
            try
            {
                var wordPack = await _context.WordPacks
                    .Include(w =>w.AppUser)
                    .Include(p => p.WordPackDetails)
                    .FirstOrDefaultAsync(p => p.WordPackId == wordPackId)
                    ?? throw new Exception($"Word pack with {wordPackId} does not exist.");
                return wordPack;
            }catch(Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }
    }
}
