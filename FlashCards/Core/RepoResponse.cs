namespace FlashCards.Api.Core
{
    public class RepoResponse<T>
    {
        public Exception? E { get; set; }
        public T Data { get; set; }
    }
}
