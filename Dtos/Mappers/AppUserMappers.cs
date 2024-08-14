

using FlashCards.Dtos.Auth;
using FlashCards.Models.Models;

namespace FlashCards.Dtos.Mappers
{
    public static class AppUserMappers
    {
        public static LoginAppUserResponse ToLoginResponse(this AppUser user)
        {
            return new LoginAppUserResponse()
            {
                Age = user.Age,
                Avatar = user.Avatar,
                Email = user.Email,
                FirstName = user.FirstName,
                Gender = user.Gender,
                LastName = user.LastName,
                Jwt = ""
            };
        } 
    }
}
