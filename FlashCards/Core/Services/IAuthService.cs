namespace FlashCards.Api.Core.Services
{
    public interface IAuthService
    {
        public bool IsPasswordEqual(byte[] dbUserPass, string reqPass, byte[] salt);
        public string GetJwtToken(byte[] key, string email,int appUserId);
        public string GetEmail();
        public int GetId();
    }
}