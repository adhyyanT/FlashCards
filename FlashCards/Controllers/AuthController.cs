using Dtos.Auth;
using FlashCards.Api.Repositories;
using FlashCards.Dtos.Auth;
using Microsoft.AspNetCore.Mvc;
using FlashCards.Dtos.Mappers;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using FlashCards.Api.Core.Services;

namespace FlashCards.Api.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppSettings _appSettings;
        private readonly IAppUserRepo _userRepo;
        private readonly IAuthService _authService;

        public AuthController(IAppUserRepo repo,IOptions<AppSettings> appSettings,IAuthService authService)
        {
            _appSettings = appSettings.Value;
            _userRepo = repo;
            _authService = authService;
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
                var isMatch = _authService.IsPasswordEqual(user.Password,userRequest.Password,user.Salt);
                if (!isMatch)
                {
                    return BadRequest($"Incorrect username or password");
                }
                var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
                
                var res = user.ToLoginResponse();
                res.Jwt = _authService.GetJwtToken(key,user.Email,user.AppUserId);
                HttpContext.Response.Cookies.Append(_appSettings.TokenName, res.Jwt, new CookieOptions
                {
                    Expires = DateTime.Now.AddDays(7),
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    IsEssential = true
                });

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
                var userResp = user.ToLoginResponse();
                var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
                userResp.Jwt = _authService.GetJwtToken(key, userResp.Email,userResp.AppUserId);
                return CreatedAtAction(nameof(Login), "" ,userResp);
            }
            catch(Exception e)
            {
                Console.WriteLine(e.Message);
                return StatusCode(500, e.Message);
            }
        }
    }
}
