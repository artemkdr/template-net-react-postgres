using API.Controllers;
using API.Data;
using API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Moq;

namespace API.Tests.Controllers
{
    public class ControllersTests
    {
        private static DbContextOptions<BaseDBContext<User>> optionsUser = 
            new DbContextOptionsBuilder<BaseDBContext<User>>()
                .UseNpgsql(TestContainers.GetConnectionString()).Options;
        
        public BaseDBContext<User> UserContext { get; }        
        
        private readonly Mock<IConfiguration> _configurationMock;
        
        public UserController UserController { get; }
        
        public ControllersTests()
        {  
            UserContext = new BaseDBContext<User>(optionsUser); 
            _configurationMock = new Mock<IConfiguration>();
            
            UserController = new UserController(_configurationMock.Object, UserContext);
        }                
    }
}