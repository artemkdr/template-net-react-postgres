using System.Text.Json;
using API.Data;
using API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class UserDTO : IBaseDTO
{   
    public string? Username { get; set; }
    public JsonDocument? Vars { get; set;}
    public string? Status { get; set; }
}

[ApiController]
public class UserController : BaseController
{
    public UserController(IConfiguration configuration, BaseDBContext<User> userContext) 
        : base(configuration, userContext)
    {
    }
        
    [Route("users/{username}")]    
    [Authorize]
    [HttpGet]
    [ProducesResponseType(typeof(UserDTO), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public IActionResult GetUser(string username)
    {        
        var item = _userContext.Items.Find(username);
        if (item == null)
            return NotFoundProblem($"User '{username}' not found");
        return Ok(new UserDTO() {
            Username = item.Username,
            Vars = item.Vars,
            Status = item.Status.ToString()
        });        
    }
    
    [Route("users")]
    [Authorize]
    [HttpGet]    
    [ProducesResponseType(typeof(ListDTO<UserDTO>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public IActionResult GetUsers(string? username = null, string? status = null, int page = 1, int limit = 0) 
    {
        if (page < 1) page = 1;
        if (limit < 1) limit = Math.Max(limit, LIST_LIMIT);
        
        var query = _userContext.Items.AsQueryable();

        // case insensitive "like '%value%'" search by name
        if (!string.IsNullOrEmpty(username))
            query = query.Where(x => x.Username != null && x.Username.ToLower().Contains(username.ToLower()));

        if (!string.IsNullOrEmpty(status))
            if (Enum.TryParse<UserStatus>(status, true, out var statusEnum))
                query = query.Where(x => x.Status == statusEnum);
            else 
                return BadRequestProblem($"status '{status}' doesn't exist");
        var totalCount = query.Count();
        var totalPages = (int)Math.Ceiling((double)totalCount / limit);
        if (page > totalPages) page = Math.Max(1, totalPages);
        
        var items = query.OrderBy(x => x.Username)
                            .Skip((page - 1) * limit)
                        .Take(limit)
                        .Select(x => new UserDTO() {
                            Username = x.Username,
                            Vars = x.Vars,                                
                            Status = x.Status.ToString()
                        })
                        .ToList();

        return Ok(new ListDTO<UserDTO>() {
            Page = page,
            PageSize = limit,
            Total = totalCount,
            TotalPages = totalPages,
            List = items.ToArray()
        });        
    }
}