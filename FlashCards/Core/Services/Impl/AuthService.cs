using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace FlashCards.Api.Core.Services.Impl
{
    public class AuthService : IAuthService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly AppSettings _appSettings;

        public AuthService(IHttpContextAccessor httpContextAccessor,AppSettings appSettings)
        {
            _appSettings = appSettings;
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
                Expires = DateTime.UtcNow.AddDays(_appSettings.TokenExpiry),
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
        public void SetToken(string tokenName, string jwt)
        {
            _httpContextAccessor.HttpContext?.Response.Cookies.Append(tokenName, jwt, new CookieOptions
            {
                Expires = DateTime.Now.AddDays(7),
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                IsEssential = true
            });
        }
        public ClaimsPrincipal? ValidateToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            //var isValid = CheckTokenIsValid(token);
            //if (!isValid) return null;

            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false,
                ClockSkew = TimeSpan.Zero
            };
            try
            {
                var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out var validatedToken);
                return principal;
            }
            catch (Exception)
            { 
                return null;
            }
        }
        private long GetTokenExpirationTime(string token)
        {
            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(token);
            var tokenExp = jwtSecurityToken.Claims.First(claim => claim.Type.Equals("exp")).Value;
            var ticks = long.Parse(tokenExp);
            return ticks;
        }

        private bool CheckTokenIsValid(string token)
        {
            var tokenTicks = GetTokenExpirationTime(token);
            var tokenDate = DateTimeOffset.FromUnixTimeSeconds(tokenTicks).UtcDateTime;

            var now = DateTime.Now.ToUniversalTime();

            var valid = tokenDate >= now;

            return valid;
        }

        public void ClearToken(string tokenName)
        {
            var context = _httpContextAccessor.HttpContext;
            context?.Response.Cookies.Delete(tokenName);
        }
    }
}
