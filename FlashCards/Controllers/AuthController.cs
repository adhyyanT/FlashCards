using Dtos.Auth;
using FlashCards.Api.Repositories;
using FlashCards.Dtos.Auth;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using FlashCards.Dtos.Mappers;
using System.Security.Cryptography;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace FlashCards.Api.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppSettings _appSettings;
        private readonly IAppUserRepo _userRepo;
        public AuthController(IAppUserRepo repo,IOptions<AppSettings> appSettings)
        {
            _appSettings = appSettings.Value;
            _userRepo = repo;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginAppUserRequest userRequest)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var user = await _userRepo.GetAppUserAsync(userRequest.Email);
                if(user is null)
                {
                    return BadRequest($"Incorrect username or password");
                }
                var isMatch = false;
                using (HMACSHA256 hmac = new(user.Salt))
                {
                    var compute = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(userRequest.Password));
                    isMatch = compute.SequenceEqual(user.Password);
                }
                if (!isMatch)
                {
                    return BadRequest($"Incorrect username or password");
                }
                var tokenHandler = new JwtSecurityTokenHandler();
                Console.WriteLine(_appSettings.Secret);
                var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new[] { new Claim("id", user.Email) }),
                    Expires = DateTime.UtcNow.AddDays(7),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key),SecurityAlgorithms.HmacSha256Signature)
                };
                var token = tokenHandler.CreateToken(tokenDescriptor);
                var encrypterToken = tokenHandler.WriteToken(token);
                Console.WriteLine(encrypterToken);
                var res = user.ToLoginResponse();
                res.Jwt = encrypterToken;
                return Ok(res);
            }
            catch(Exception e)
            {
                Console.WriteLine(e.Message);
                return StatusCode(500, e.Message);
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Regsiter([FromBody] RegisterUserRequest registerUserRequest)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);
                if (registerUserRequest.ConfirmPassword != registerUserRequest.Password)
                {
                    return BadRequest("Confirm password does not match");
                }
                var opUser = await _userRepo.GetAppUserAsync(registerUserRequest.Email);
                if (opUser is not null)
                {
                    return BadRequest($"A user already exist for {registerUserRequest.Email}");
                }
                var user = await _userRepo.CreateAppUser(registerUserRequest) ?? throw new Exception("Unable to create user");

                return CreatedAtAction(nameof(Login), "" ,user.ToLoginResponse());
            }
            catch(Exception e)
            {
                Console.WriteLine(e.Message);
                return StatusCode(500, e.Message);
            }
        }
        [Authorize]
        [HttpGet("HelloWorld")]
        public IActionResult HelloWorld()
        {
            return Ok("Hello world");
        }
    }
}
