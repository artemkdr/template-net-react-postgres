using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using API.Data;
using API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace API.Controllers;

[ApiController]
public class LoginController : BaseController
{
    private Authenticator _authenticator;

    public LoginController(IConfiguration configuration, BaseDBContext<User> userContext) 
        : base(configuration, userContext)
    {
        _authenticator = new Authenticator(configuration);
    }

    [Route("login")]
    [HttpPost]
    public IActionResult Login(LoginDTO loginDto)
    {
        var token = _authenticator.Authenticate(_userContext.Items.Find(loginDto.Username), loginDto.Password);
        if (token != null)
            return Ok(new TokenDTO(token));
        else 
            return UnauthorizedProblem("Invalid username or password");
    }
}

public class LoginDTO
{
    [Required]
    public string? Username { get; set; }
    [Required]
    public string? Password { get; set; }
}

public class TokenDTO 
{
    public string Token { get; set; }

    public TokenDTO(string token) {
        Token = token;
    }
}