using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using RTSStockApp.Server.Configuration;
using RTSStockApp.Server.Extensions;
using RTSStockApp.Server.Services;

namespace RTSStockApp.Server;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.Configure<FinnHubSettings>(builder.Configuration.GetRequiredSection(nameof(FinnHubSettings)));

        builder.Services.AddDbContext<StockAppDbContext>(options =>
            options.UseInMemoryDatabase("StockAppDb"));

        builder.Services.AddAuthorization();

        builder.Services.AddControllers();
        builder.Services.AddIdentityApiEndpoints<IdentityUser>(opt =>
        {
            opt.User.RequireUniqueEmail = true;
            opt.SignIn.RequireConfirmedAccount = false;
        })
        .AddEntityFrameworkStores<StockAppDbContext>();


        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen(opt =>
        {
            opt.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Description = "Enter 'Bearer {token_here}' " ,
                Name = "Authorization",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.ApiKey,
                Scheme = "Bearer"
            });
            opt.AddSecurityRequirement(new OpenApiSecurityRequirement()
            { 
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        },
                        Scheme = "oauth2",
                        Name = "Bearer",
                        In = ParameterLocation.Header,

                    },
                    new List<string>()
                }
            });
        });

        AddServices(builder);

        var app = builder.Build();

        app.UseDefaultFiles();
        app.UseStaticFiles();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();
        app.UseAuthentication();
        app.UseAuthorization();

        app.MapGroup("/api/v1")
            .MapCustomIdentityApi<IdentityUser>();
        app.MapControllers();

        app.MapFallbackToFile("/index.html");

        app.Run();
    }

    private static void AddServices(WebApplicationBuilder builder)
    {
        builder.Services.AddHttpClient<IStockService, StockService>(options =>
        {
            options.BaseAddress = new Uri("https://finnhub.io/api/v1/");
        });
    }
}
