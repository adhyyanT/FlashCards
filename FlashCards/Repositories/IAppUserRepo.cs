using Dtos.Auth;
using FlashCards.Models.Models;

namespace FlashCards.Api.Repositories
{
    public interface IAppUserRepo
    {
        Task<AppUser?> GetAppUserAsync(string email);
        Task<AppUser?> CreateAppUser(RegisterUserRequest userRequest);
    }
}
