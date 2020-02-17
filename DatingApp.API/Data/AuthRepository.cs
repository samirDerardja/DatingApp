using System;
using System.Threading.Tasks;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class AuthRepository : IauthRepository
    {

        //accessible uniquement dans la classe
        private readonly DataContext _context;
        //injection de dependance : contrat passé entre la classe et l interface
        public AuthRepository(DataContext context)
        {

            //acces du context dans tous le repository
            _context = context;
        }
        public  async Task<User> Login(string username, string password)
        {
            var loginUser = await  _context.Users.FirstOrDefaultAsync(x => x.Username == username);

            if(loginUser == null) 
                return null;
            if(!VerifyPasswordHash(password, loginUser.PasswordSalt, loginUser.PasswordSalt))
            return null;

            return loginUser;
        }

        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {

            //le passwordhash en parametre et le meme quand dans la fonction createpasswordHash
            // il va comparer si ils sont identiques
             using (var HashMap = new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {
               var  computeHash = HashMap.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
               for(int i = 0; i  < computeHash.Length; i++) {
                   if(computeHash[i] != passwordHash[i])
                   return false;
               }
               return true;
            }
           
        }

        public async Task<User> Register(User user, string password)
        {
            byte[] passwordHash, passwordSalt;
            //quand le mot tde passe est mis a jour, le hash et salt sont mis a jour
            CreatePasswordHash(out passwordHash, password, out passwordSalt) ;
                user.PasswordHash = passwordHash;
                user.PasswordSalt = passwordSalt;

                await _context.Users.AddAsync(user);
                await _context.SaveChangesAsync();

                return user;

        }

        private void CreatePasswordHash(out byte[] passwordHash, string password, out byte[] passwordSalt)
        {
            using (var HashMap = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = HashMap.Key;
                passwordHash = HashMap.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        public async Task<bool> UserExists(string username)
        {
           if(await _context.Users.AnyAsync(x => x.Username == username ))
           return true;
           return false;
        }
        
    }

}