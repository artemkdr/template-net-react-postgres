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
    

    public LoginController(IConfiguration configuration, BaseDBContext<User> userContext) 
        : base(configuration, userContext)
    {
    }

    [Route("login")]
    [HttpPost]
    public IActionResult Login(LoginDTO loginDto)
    {
        var token = this.Authenticate(loginDto.Username!, loginDto.Password!);
        if (token != null)
            return Ok(new TokenDTO(token));
        else 
            return UnauthorizedProblem("Invalid username or password");
    }

    private string? Authenticate(string username, string password)
    {        
        User? user = _userContext.Items.Find(username);
        if (user != null) {        
            string? storedHash = user.Password;
            bool isValid = storedHash != null && BCrypt.Net.BCrypt.EnhancedVerify(password, storedHash);
            if (isValid) {
                // If credentials are valid, generate JWT token                    
                return this.GenerateAccessToken(username!);
            }
        }
        return null;
    }

    private string GenerateAccessToken(string username, string[]? roles = null) {
        if (_configuration["JwtSettings:Secret"] == null) {
            throw new InvalidOperationException("JwtSettings:Secret is not found in the configuration file!");
        }
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_configuration["JwtSettings:Secret"]!);        
        Int32.TryParse(_configuration["JwtSettings:ExpireInDays"], out int days);
        if (days <= 0) 
            days = 30;        
        var claims = new List<Claim>() {
            new Claim(ClaimTypes.Name, username),
            new Claim(ClaimTypes.NameIdentifier, username)
        };
        if (roles != null) {
            foreach (var role in roles) {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }
        }
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),            
            Expires = DateTime.UtcNow.AddDays(days), // Set token expiration            
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
            Issuer = _configuration["JwtSettings:Issuer"],
            Audience = _configuration["JwtSettings:Audience"]
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);        
        return tokenHandler.WriteToken(token);   
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