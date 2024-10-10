using System.Net;
using API.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Moq;

namespace API.Tests.Controllers;

public class HealthControllerTests
{
    [Fact]
    public void Get_HealthController_ReturnsSuccessResult()
    {
        // Arrange
        var mockConfig = new Mock<IConfiguration>();        
        var controller = new HealthController(mockConfig.Object);
        
        // Act
        var result = controller.Get();

        // Assert
        Assert.IsType<OkObjectResult>(result);        
    }
}