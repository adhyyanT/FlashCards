using Dtos.Auth;
using FlashCards.Database;
using FlashCards.Models.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace FlashCards.Api.Repositories.impl
{
    public class AppUserRepo : IAppUserRepo
    {
        private readonly ApplicationDBContext _context;

        public AppUserRepo(ApplicationDBContext context)
        {
            this._context = context;
        }


        public async Task<AppUser?> GetAppUserAsync(string email)
        {
            try
            {
                var user = await _context.AppUsers.FirstOrDefaultAsync(User => User.Email == email);
                return user;
            }
            catch(Exception e)
            {
                Console.WriteLine(e);
                return null;
            }
        }
        public async Task<AppUser?> CreateAppUser(RegisterUserRequest userRequest)
        {
            try
            {
                AppUser user = new()
                {
                    Age = userRequest.Age,
                    Avatar = userRequest.Avatar,
                    CreatedOn = DateTime.Now,
                    Email = userRequest.Email,
                    FirstName = userRequest.FirstName,
                    Gender = userRequest.Gender,
                    LastName = userRequest.LastName,
                };
                using (HMACSHA256 hmac = new())
                {
                    user.Salt = hmac.Key;
                    user.Password = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(userRequest.Password));
                }
                await _context.AppUsers.AddAsync(user);
                await _context.SaveChangesAsync();
                return user;
            }
            catch(Exception e)
            {
                Console.WriteLine(e.StackTrace);
                return null;
            }
        }
    }
}
