using FlashCards.Api;
using FlashCards.Api.Repositories;
using FlashCards.Api.Repositories.impl;
using FlashCards.Database;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using FlashCards.Api.Core.Services;
using FlashCards.Api.Core.Services.Impl;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddHttpContextAccessor();
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<ApplicationDBContext>(options =>
{
    options.UseMySQL(builder.Configuration.GetConnectionString("Default") ?? throw new Exception("DataBase Connection string Not found."));
});
builder.Services.AddScoped<IAppUserRepo, AppUserRepo>();
builder.Services.AddScoped<IAuthService,AuthService>();
builder.Services.AddScoped<IWordPackRepo, WordPackRepo>();

builder.Services.Configure<AppSettings>(builder.Configuration.GetSection("ApplicationSettings"));
//var jwtIssuer = builder.Configuration.GetSection("Jwt:Issuer").Get<string>();
var jwtKey = builder.Configuration.GetSection("ApplicationSettings:Secret").Get<string>() ?? throw new Exception("Secret not found");
var tokenName = builder.Configuration.GetSection("ApplicationSettings:TokenName").Get<string>() ?? throw new Exception("Token Name not found");
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddCookie(x => x.Cookie.Name = tokenName)
 .AddJwtBearer(options =>
 {
     options.TokenValidationParameters = new TokenValidationParameters
     {
         ValidateIssuer = false,
         ValidateAudience = false,
         ValidateLifetime = true,
         ValidateIssuerSigningKey = true,
         IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
     };
     options.SaveToken = true;
     options.RequireHttpsMetadata = false;
     options.Events = new JwtBearerEvents
     {
         OnMessageReceived = context =>
         {
             context.Token = context.Request.Cookies[tokenName];
             return Task.CompletedTask;
         }
     };
 });
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
