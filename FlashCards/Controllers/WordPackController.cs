﻿using FlashCards.Api.Repositories;
using FlashCards.Dtos.Mappers;
using FlashCards.Dtos.WordPackDtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FlashCards.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WordPackController : ControllerBase
    {
        private readonly IWordPackRepo _wordPackRepo;

        public WordPackController(IWordPackRepo wordPackRepo)
        {
            _wordPackRepo = wordPackRepo;
        }

        [HttpPost("create"), Authorize]
        public async Task<IActionResult> CreateWordPack([FromBody] WordPackCreateRequest wordPackReq)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var wordPack = await _wordPackRepo.CreateWordPackAsync(wordPackReq);
                return CreatedAtAction("CreateWordPack", wordPack.ToWordPackResponse());
            }
            catch(Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }
        [HttpGet("user"), Authorize]
        public async Task<IActionResult> GetWordPacksByAppUserId()
        {
            try
            {

                var wordPacks = await _wordPackRepo.GetWordPacksByAppUserIdAsync();
                return Ok(wordPacks.Select(p => p.ToWordPackResponse()).ToList());
            } catch(Exception e)
            {
                return StatusCode(500, e.Message);

            }
        }

        // Get public packs
        // Delete endpoints

        [HttpGet("{wordPackId}/words"), Authorize]
        public async Task<IActionResult> GetWordPackDetailsByPackId([FromRoute] int wordPackId)
        {
            try
            { 
                var wordPackDetails = await _wordPackRepo.GetWordPackDetailsByPackIdAsync(wordPackId);
                return Ok(wordPackDetails.Select(d => d.ToWordPackDetailResp()).ToList());
            } catch(Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }
    }
}
