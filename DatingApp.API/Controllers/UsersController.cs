using System;
using System.Security.Claims;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DatingApp.API.Helpers;

namespace DatingApp.API.Controllers
{

    // [ServiceFilter(typeof(LogUserActivity))]

    [Route("api/[controller]")]
    [ApiController]
    public class UsersController: ControllerBase
    {
        private readonly IDatingRepository _repo;
         private readonly IMapper _mapper;
        public UsersController(IDatingRepository repo, IMapper mapper)
        {
           _repo = repo; 
           _mapper = mapper;
        }


        [HttpGet]
      public async Task<IActionResult> GetUsers([FromQuery]UserParams userParams)
        {
             var users = await _repo.GetUsers(userParams);

            var usersToReturn = _mapper.Map<IEnumerable<UserForListDto>>(users);
            
            return Ok(usersToReturn);
        }


        [HttpGet("{id}", Name="GetUser")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _repo.GetUser(id);
            var userReturn = _mapper.Map<UserForDetailedDto>(user);

            user.LastActive = DateTime.Now;
        
            await _repo.SaveAll();
            return Ok(userReturn);
        }
 
        [HttpPut("{id}")] 
        public async Task<IActionResult> UpdateUser(int id, UserForUpdateDto userForUpdateDto)
        {
 
            var userFromRepo = await _repo.GetUser(id);
            _mapper.Map(userForUpdateDto , userFromRepo);
            if ( await _repo.SaveAll())
            return NoContent();

            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            return Unauthorized();

            
            throw new Exception("error");
        }
    }
}