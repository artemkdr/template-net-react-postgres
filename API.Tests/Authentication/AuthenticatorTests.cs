using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Moq;

namespace API.Tests
{    
    public class AuthenticatorTests
    {
        private Mock<IConfiguration> _mockConfiguration;
        private Authenticator _authenticator;
        
        public AuthenticatorTests()
        {
            _mockConfiguration = new Mock<IConfiguration>();
            _mockConfiguration.SetupGet(c => c["JwtSettings:Secret"]).Returns("ThisIsMyVerySecretKeyThisIsMyVerySecretKey");
            _mockConfiguration.SetupGet(c => c["JwtSettings:ExpireInDays"]).Returns("30");
            _mockConfiguration.SetupGet(c => c["JwtSettings:Issuer"]).Returns("your-issuer");
            _mockConfiguration.SetupGet(c => c["JwtSettings:Audience"]).Returns("your-audience");

            _authenticator = new Authenticator(_mockConfiguration.Object);
        }

        [Fact]
        public void Authenticate_NoJwtSettingsSecretConfiguration_ThrowsException()
        {
            // Arrange
            var mockConfiguration = new Mock<IConfiguration>();
            var authenticator = new Authenticator(mockConfiguration.Object);

            var mockUser = new Mock<IUser>();
            mockUser.SetupGet(u => u.Username).Returns("testuser");
            mockUser.SetupGet(u => u.Password).Returns(BCrypt.Net.BCrypt.EnhancedHashPassword("password"));

            // Assert
            Assert.Throws<InvalidOperationException>(() => authenticator.Authenticate(mockUser.Object, "password"));
        }

        [Fact]
        public void Authenticate_OnlyJwtSettingsSecretConfiguration_ReturnsToken()
        {
            // Arrange
            var mockConfiguration = new Mock<IConfiguration>();
            var authenticator = new Authenticator(mockConfiguration.Object);
            mockConfiguration.SetupGet(c => c["JwtSettings:Secret"]).Returns("ThisIsMyVerySecretKeyThisIsMyVerySecretKey");
                        

            var mockUser = new Mock<IUser>();
            mockUser.SetupGet(u => u.Username).Returns("testuser");
            mockUser.SetupGet(u => u.Password).Returns(BCrypt.Net.BCrypt.EnhancedHashPassword("password"));

            // Act
            var token = _authenticator.Authenticate(mockUser.Object, "password");

            // Assert
            Assert.NotNull(token);
            Assert.NotEmpty(token);
        }

        [Fact]
        public void Authenticate_ValidCredentials_ReturnsToken()
        {
            // Arrange
            var user = new Mock<IUser>();
            user.SetupGet(u => u.Username).Returns("testuser");
            user.SetupGet(u => u.Password).Returns(BCrypt.Net.BCrypt.EnhancedHashPassword("password"));

            // Act
            var token = _authenticator.Authenticate(user.Object, "password");

            // Assert
            Assert.NotNull(token);
            Assert.NotEmpty(token);
        }

        [Fact]
        public void Authenticate_InvalidCredentials_ReturnsNull()
        {
            // Arrange
            var user = new Mock<IUser>();
            user.SetupGet(u => u.Username).Returns("testuser");
            user.SetupGet(u => u.Password).Returns(BCrypt.Net.BCrypt.EnhancedHashPassword("password"));

            // Act
            var token = _authenticator.Authenticate(user.Object, "wrongpassword");

            // Assert
            Assert.Null(token);
        }

        [Fact]
        public void Authenticate_NullUser_ReturnsNull()
        {
            // Act
            var token = _authenticator.Authenticate(null, "password");

            // Assert
            Assert.Null(token);
        }

        [Fact]
        public void Authenticate_NullPassword_ReturnsNull()
        {
            // Act
            var token = _authenticator.Authenticate(null, null);

            // Assert
            Assert.Null(token);
        }

        
    }
}