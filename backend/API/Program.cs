using Application.Interfaces;
using Application.Services;
using Infrastructure.Data;
using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 1. Database Configuration (PostgreSQL)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "Host=localhost;Port=5432;Database=AirportManagementDb;Username=postgres;Password=postgres";

builder.Services.AddDbContext<AirportDbContext>(options =>
{
    options.UseNpgsql(connectionString);
});

// 2. Dependency Injection (Clean Architecture)
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IFlightService, FlightService>();
builder.Services.AddScoped<ITourService, TourService>();
builder.Services.AddScoped<IDestinationService, DestinationService>();
builder.Services.AddScoped<IBookingService, BookingService>();
builder.Services.AddScoped<ISeatService, SeatService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ICouponService, CouponService>();
builder.Services.AddScoped<IArticleService, ArticleService>();
builder.Services.AddScoped<IAnalyticsService, AnalyticsService>();

// 3. Controllers & JSON Serialization (CamelCase for React compatibility)
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
    });

// 4. CORS Policy for Frontend Portals (Port 5173 & 5174)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontendPortals", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173", 
                "http://localhost:5174",
                "http://127.0.0.1:5173",
                "http://127.0.0.1:5174"
              )
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// 5. Swagger / OpenAPI Interactive Documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 6. Database Migration & Seed on Startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AirportDbContext>();
        await DbInitializer.InitializeAsync(context);
        Console.WriteLine("[DB INITIALIZER] PostgreSQL database initialized and seeded successfully.");
    }
    catch (Exception ex)
    {
        Console.ForegroundColor = ConsoleColor.Yellow;
        Console.WriteLine($"[DB INITIALIZER WARNING] Could not connect to PostgreSQL instance ({ex.Message}). Ensure PostgreSQL is running on port 5432 or update DefaultConnection in appsettings.json.");
        Console.ResetColor();
    }
}

// 7. HTTP Pipeline Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Airport API v1");
        c.RoutePrefix = "swagger";
    });
}

app.UseCors("AllowFrontendPortals");

app.UseAuthorization();

app.MapControllers();

app.Run();
