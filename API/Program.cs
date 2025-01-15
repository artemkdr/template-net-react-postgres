using Microsoft.OpenApi.Models;
using NLog.Web;
using NLog.Extensions.Logging;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using API.Data;
using API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using API.Discovery;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();
builder.Logging.AddNLog();


builder.Services.AddControllers(options => {
    // produce 'application/json' by default
    options.Filters.Add(new ProducesAttribute("application/json"));
}).AddJsonOptions(options => {
    // camelCase JSON by default
    options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;    
});

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(corsBuilder =>
    {
        var allowedOrigins = builder.Configuration["AllowedOrigins"]?.Split(",", StringSplitOptions.RemoveEmptyEntries);        
        if (allowedOrigins?.Any() == true) {            
            corsBuilder.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod();            
        }
    });
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services
    .AddDbContext<BaseDBContext<User>>(
        options => options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")
    ));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options => {
    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters() {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
        ValidAudience = builder.Configuration["JwtSettings:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:Secret"])),
        ClockSkew = TimeSpan.Zero
    };    
});

// Register with Consul
if (builder.Configuration.GetSection("Consul") != null) {    
    builder.Services.AddHostedService<AutoDiscoveryService>();
}

var app = builder.Build();

// Configure the HTTP request pipeline.
var swaggerUrlPrefix = builder.Configuration.GetValue<string>("SwaggerUrlPrefix");
app.UseSwagger(c =>
{
    if (swaggerUrlPrefix != null)
    {
        c.PreSerializeFilters.Add((swaggerDoc, httpReq) =>
        {
            var paths = new OpenApiPaths();
            foreach (var path in swaggerDoc.Paths)
            {
                paths.Add((swaggerUrlPrefix + path.Key).Replace("//", "/"), path.Value);
            }
            swaggerDoc.Paths = paths;
        });
    }    
});
app.UseSwaggerUI();

//app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.UseCors();
app.MapControllers();

// exceptions handler
app.UseExceptionHandler(exceptionHandlerApp =>
{
    exceptionHandlerApp.Run(async context =>
    {
        var exceptionHandlerPathFeature = context.Features.Get<IExceptionHandlerPathFeature>();
        var exception = exceptionHandlerPathFeature?.Error;
        var problemDetails = new ProblemDetails() {
            Status = StatusCodes.Status500InternalServerError,
            Title = "An unexpected error occurred.",
            Type = "https://tools.ietf.org/html/rfc7231#section-6.6.1"
        };

        if (app.Environment.IsDevelopment()) {
            problemDetails.Detail = exception?.Message;
            problemDetails.Extensions["stackTrace"] = exception?.StackTrace;
        }

        NLog.LogManager.GetCurrentClassLogger().Error(exception);

        context.Response.StatusCode = problemDetails.Status.Value;
        context.Response.ContentType = "application/problem+json";   

        await context.Response.WriteAsJsonAsync(problemDetails);
    });
});

app.Run();