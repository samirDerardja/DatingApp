using System.Threading.Tasks;
using DatingApp.API.Models;

namespace DatingApp.API.Data
{
    public interface IauthRepository
    {
         Task<User> Register(User user, string password);
         Task<User> Login(string username, string pasword);
         Task<bool> UserExists(string username);
    }
}