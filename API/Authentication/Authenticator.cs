using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace API;

public interface IUser {
    public string? Username { get; set; }

    public string? Password { get; set; }
}

public class Authenticator
{
    private IConfiguration _configuration;
    public Authenticator(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string? Authenticate(IUser? user, string? password)
    {   
        if (user != null && user.Username != null && password != null) {        
            string? storedHash = user.Password;
            bool isValid = storedHash != null && BCrypt.Net.BCrypt.EnhancedVerify(password, storedHash);
            if (isValid) {
                // If credentials are valid, generate JWT token                    
                return this.GenerateAccessToken(user.Username);
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