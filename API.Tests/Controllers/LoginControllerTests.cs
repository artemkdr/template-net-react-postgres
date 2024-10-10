using API.Controllers;
using API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Moq;

namespace API.Tests.Controllers;

public class LoginControllerTests : IDisposable
{
    private ControllersTests controllerTests;

    private LoginController loginController;

    public LoginControllerTests()
    {
        var _configurationMock = new Mock<IConfiguration>();
        _configurationMock.SetupGet(c => c["JwtSettings:Secret"]).Returns("secretkeysecretkeysecretkeysecretkey");
        controllerTests = new ControllersTests();
        loginController = new LoginController(_configurationMock.Object, controllerTests.UserContext);
        controllerTests.UserContext.Database.BeginTransaction();        
    }

    public void Dispose() {
        controllerTests.UserContext.Database.RollbackTransaction();            
    }

    [DockerRequiredFact]
    public void Login_ValidCredentials_ReturnsOkWithToken()
    {
        // Arrange
        var loginDto = new LoginDTO { Username = "testuser", Password = "password" };
        var user = new User { Username = "testuser", Password = BCrypt.Net.BCrypt.EnhancedHashPassword("password") };
        controllerTests.UserContext.Items.Add(user);
        controllerTests.UserContext.SaveChanges();

        // Act
        var result = loginController.Login(loginDto);
        
        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);
        Assert.True((okResult.Value as TokenDTO)?.Token.Length > 0); 
    }

    [DockerRequiredFact]
    public void Login_InvalidCredentials_ReturnsUnauthorized()
    {
        // Arrange
        var loginDto = new LoginDTO { Username = "testuser", Password = "wrongpassword" };
        var user = new User { Username = "testuser", Password = BCrypt.Net.BCrypt.EnhancedHashPassword("password") };
        controllerTests.UserContext.Items.Add(user);
        controllerTests.UserContext.SaveChanges();

        // Act
        var result = loginController.Login(loginDto);

        // Assert
        Assert.IsType<ObjectResult>(result);
        Assert.Equal(StatusCodes.Status401Unauthorized, ((ObjectResult)result).StatusCode);
    }

    [DockerRequiredFact]
    public void Login_UserNotFound_ReturnsUnauthorized()
    {
        // Arrange
        var loginDto = new LoginDTO { Username = "nonexistentuser", Password = "password" };
        
        // Act
        var result = loginController.Login(loginDto);

        // Assert
        Assert.IsType<ObjectResult>(result);
        Assert.Equal(StatusCodes.Status401Unauthorized, ((ObjectResult)result).StatusCode);
    }
    
}