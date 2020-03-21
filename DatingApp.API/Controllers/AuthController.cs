
using System.Net;
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
using Microsoft.AspNetCore.Authorization;
using AutoMapper;

namespace DatingApp.API.Controllers
{

  [AllowAnonymous]
    [Route("api/[controller]")]
    // si l APIcontroller est absent, l instance userRegisterForDtos ne sera pas appelée
    [ApiController]

    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _IConfig;

        private readonly IauthRepository _repo;

        private readonly IMapper _mapper;

        public AuthController(IauthRepository repo, IConfiguration IConfig,   IMapper  mapper)
        {
            _IConfig = IConfig;
            _mapper = mapper;
            _repo = repo;
        }

        [HttpPost("Register")]


        public async Task<IActionResult> Register(UserForRegisterDtos userRegisterForDtos)

        {
            //validation de la req
            userRegisterForDtos.Username = userRegisterForDtos.Username.ToLower();

            if (await _repo.UserExists(userRegisterForDtos.Username))
                return BadRequest("Username all ready exist");

            var userToCreate = _mapper.Map<User>(userRegisterForDtos);

            var createdUser = await _repo.Register(userToCreate, userRegisterForDtos.Password);
            var usersToReturn = _mapper.Map<UserForDetailedDto>(createdUser);

            return CreatedAtRoute("GetUser", new {controller = "Users" , id =  createdUser.Id}, usersToReturn);

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
                SigningCredentials = creds
               
            };
            //on crée le nouveau token avec comme parametres le tokendescription
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescription); 
            var  user  = _mapper.Map<UserForListDto>(userFromRepo);
            //on retour la reponse avec le token creer du server => au client
            return Ok(new
            {
                token = tokenHandler.WriteToken(token),
                user
                // fullname = userFromRepo.Username
            });


        }

    }
}