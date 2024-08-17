using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;

namespace FlashCards.Api.Core.Services.Impl
{
    public class AuthService : IAuthService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuthService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public string GetEmail()
        {
            var email = string.Empty;
            if(_httpContextAccessor.HttpContext is not null)
            {
                email = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Email);
            }
            return email;
        }
        public int GetId()
        {
            int id = -1;
            if (_httpContextAccessor.HttpContext is not null)
            {
                id = Int32.Parse(_httpContextAccessor.HttpContext.User.FindFirstValue("id") ?? "-1");   
            }
            return id != -1 ? id : throw new Exception("UnAuthorized");
        }

        public string GetJwtToken(byte[] key, string email,int id)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim(ClaimTypes.Email, email)
                    ,new Claim("id", id.ToString()) }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var encrypterToken = tokenHandler.WriteToken(token);
            return encrypterToken;
        }

        public bool IsPasswordEqual(byte[] dbUserPass, string reqPass, byte[] salt)
        {
            var isMatch = false;
            using (HMACSHA256 hmac = new(salt))
            {
                var compute = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(reqPass));
                isMatch = compute.SequenceEqual(dbUserPass);
            }
            return isMatch;
        }
    }
}
