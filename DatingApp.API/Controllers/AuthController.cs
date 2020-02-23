
using System.Security.Claims;
using System;
using System.Threading.Tasks;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;


namespace DatingApp.API.Controllers
{

    [Route("api/[controller]")]
    // si l APIcontroller est absent, l instance userRegisterForDtos ne sera pas appelée
    [ApiController]

    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _IConfig;

        private readonly IauthRepository _repo;

        public AuthController(IauthRepository repo, IConfiguration IConfig)
        {
            _IConfig = IConfig;
            _repo = repo;
        }

        [HttpPost("Register")]


        public async Task<IActionResult> Register(UserForRegisterDtos userRegisterForDtos)

        {
            //validation de la req
            userRegisterForDtos.Username = userRegisterForDtos.Username.ToLower();

            if (await _repo.UserExists(userRegisterForDtos.Username))
                return BadRequest("Username all ready exist");

            var userToCreate = new User

            {
                Username = userRegisterForDtos.Username
            };

            var createUser = await _repo.Register(userToCreate, userRegisterForDtos.Password);

            return StatusCode(201);

        }


        [HttpPost("login")]

        public async Task<IActionResult> Login(UserForLoginDtos userForLoginDtos)
        {

 
            //on recupere les parametres pour le login 
            var userFromRepo = await _repo.Login(userForLoginDtos.Username.ToLower(), userForLoginDtos.Password);

            //si vide, on interdit
            if (userFromRepo == null)

                return Unauthorized();


            var claims = new[]
            {
 
                // claims contenu dans le token
                //Les revendications représentent les attributs du sujet qui sont utiles dans le contexte des opérations d’authentification et d’autorisation
                new Claim(ClaimTypes.NameIdentifier, userFromRepo.Id.ToString()),
                new Claim(ClaimTypes.Name, userFromRepo.Username)
            };


            //creation de la clef secrete , ajouté dans appseting.json
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_IConfig.GetSection("AppSettings:Token").Value));

            //on encrypt la clef via un hashSHA512 en creant une nouvelle signature
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            // on instencie la decription du token en faisant passé en parametre le claims, la date du jour, et la clef crypté et securisé   
            var tokenDescription = new SecurityTokenDescriptor
            {

                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds,
                Issuer = "localhost",
                Audience = "localhost"
            };
            //on crée le nouveau token avec comme parametres le tokendescription
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescription); 
            //on retour la reponse avec le token creer du server => au client
            return Ok(new
            {
                token = tokenHandler.WriteToken(token),
                fullname = userFromRepo.Username
            });


        }

    }
}