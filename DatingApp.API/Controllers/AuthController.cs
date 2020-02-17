
using System;
using System.Threading.Tasks;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{

    [Route("api/[controller]")]
    [ApiController]

    public class AuthController : ControllerBase
    {

        private readonly IauthRepository _repo;
        public AuthController(IauthRepository repo)
        {
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

            var createUser = await _repo.Register(userToCreate, userRegisterForDtos.password);

           return  StatusCode(201);

        }

    } 
}