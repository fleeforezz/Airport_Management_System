# Airport Management & Booking System — Backend Architecture (ASP.NET Core & EF Core)

> **Document Version:** 2.0.0  
> **Framework:** .NET 8.0 / ASP.NET Core Web API  
> **ORM Engine:** Entity Framework Core 8 (Code-First)  
> **Database Targets:** Microsoft SQL Server / PostgreSQL  
> **Design Pattern:** Clean Architecture / N-Tier Architecture with Generic Repository & Service Pattern  

---

## 1. Architectural Overview & Migration Roadmap

The backend is transitioning from a standalone console data practice model to an enterprise-grade **RESTful Web API** powered by **ASP.NET Core** and **Entity Framework Core (EF Core)**. This API serves both the client-facing **Passenger WebApp** and the high-throughput **Airport Dispatch Admin Portal**.

### System Topology

```
+---------------------------------------------------------------------------------+
|                                 CLIENT CLIENTS                                  |
|   +------------------------------------+   +--------------------------------+   |
|   |  Passenger WebApp (Port 5173)      |   |  Admin Dispatch (Port 5174)   |   |
|   |  Vite + React + Tailwind (Client)  |   |  FIDS + Dispatch Scheduling    |   |
|   +------------------------------------+   +--------------------------------+   |
+---------------------------------------+-----------------------------------------+
                                        | HTTP / JSON (REST APIs) + JWT Bearer
                                        v
+---------------------------------------------------------------------------------+
|                        ASP.NET CORE 8 WEB API LAYER                             |
|  - Routing & Model Binding                 - Global Exception Handling          |
|  - JWT Authentication & RBAC Filters       - Swagger / OpenAPI Documentation    |
|  - Controllers: Auth, Flights, Bookings, Tours, Destinations, Manifest, etc.   |
+---------------------------------------+-----------------------------------------+
                                        |
                                        v
+---------------------------------------------------------------------------------+
|                       APPLICATION & BUSINESS LOGIC LAYER                        |
|  - Service Interfaces & Implementations   - Business Rules & Seat Allocations   |
|  - DTOs & Model Mapping (AutoMapper)       - Flight Dispatch & PNR Generation   |
+---------------------------------------+-----------------------------------------+
                                        |
                                        v
+---------------------------------------------------------------------------------+
|                      DATA ACCESS & PERSISTENCE LAYER                            |
|  - Entity Framework Core 8 (Code-First)    - AirportDbContext                   |
|  - Fluent API Relational Configurations    - Unit of Work & Generic Repositories|
+---------------------------------------+-----------------------------------------+
                                        |
                                        v
+---------------------------------------------------------------------------------+
|                               DATABASE STORAGE                                  |
|         Microsoft SQL Server 2022 / PostgreSQL 16 (15 Relational Tables)        |
+---------------------------------------------------------------------------------+
```

---

## 2. Project Directory Structure

```
backend/
├── AirportManagement.Api/                  # Web API Presentation Tier
│   ├── Controllers/
│   │   ├── AuthController.cs
│   │   ├── FlightsController.cs
│   │   ├── ToursController.cs
│   │   ├── DestinationsController.cs
│   │   ├── BookingsController.cs
│   │   ├── PassengersController.cs
│   │   ├── CouponsController.cs
│   │   ├── ArticlesController.cs
│   │   └── AnalyticsController.cs
│   ├── Middleware/
│   │   ├── ExceptionHandlingMiddleware.cs
│   │   └── RequestLoggingMiddleware.cs
│   ├── Program.cs                         # Dependency Injection, Middleware pipeline
│   ├── appsettings.json                   # Connection strings, JWT settings
│   └── appsettings.Development.json
│
├── AirportManagement.Core/                 # Domain Entities & Business Contracts
│   ├── Entities/                          # Domain POCO Models
│   │   ├── Airport.cs
│   │   ├── Airline.cs
│   │   ├── Aircraft.cs
│   │   ├── Seat.cs
│   │   ├── Flight.cs
│   │   ├── Destination.cs
│   │   ├── Tour.cs
│   │   ├── ItineraryDay.cs
│   │   ├── UserAccount.cs
│   │   ├── Booking.cs
│   │   ├── Passenger.cs
│   │   ├── SeatAssignment.cs
│   │   ├── Payment.cs
│   │   ├── Coupon.cs
│   │   └── Article.cs
│   ├── Enums/                             # Domain Enums
│   │   ├── UserRole.cs
│   │   ├── FlightStatus.cs
│   │   ├── BookingStatus.cs
│   │   ├── PassengerType.cs
│   │   ├── SeatClass.cs
│   │   ├── PaymentMethod.cs
│   │   └── PaymentStatus.cs
│   ├── Interfaces/                        # Service & Repository Contracts
│   │   ├── IRepository.cs
│   │   ├── IFlightService.cs
│   │   ├── IBookingService.cs
│   │   └── IAuthService.cs
│   └── DTOs/                              # Request / Response Contracts
│       ├── Auth/
│       ├── Flights/
│       ├── Bookings/
│       └── Tours/
│
└── AirportManagement.Infrastructure/       # Data Access & External Services
    ├── Data/
    │   ├── AirportDbContext.cs            # EF Core DbContext
    │   ├── DbInitializer.cs               # Initial Seed Data
    │   └── Configurations/                # Fluent API Entity Configurations
    │       ├── FlightConfiguration.cs
    │       ├── BookingConfiguration.cs
    │       └── SeatAssignmentConfiguration.cs
    ├── Migrations/                        # EF Core Code-First Migrations
    └── Repositories/                      # Repository Implementations
        └── Repository.cs
```

---

## 3. Entity Framework Core Data Models (POCOs)

Below are representative C# entity models demonstrating navigational relationships, foreign keys, and annotations.

### 3.1. `Flight.cs` (Dispatched Flight Slot)
```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AirportManagement.Core.Entities;

[Table("Flights")]
public class Flight
{
    [Key]
    public int Id { get; set; }

    [Required]
    [StringLength(10)]
    public string FlightNumber { get; set; } = string.Empty; // e.g., "VN-124"

    public int? TourId { get; set; }
    public virtual Tour? Tour { get; set; }

    [Required]
    public int OriginAirportId { get; set; }
    [ForeignKey(nameof(OriginAirportId))]
    public virtual Airport OriginAirport { get; set; } = null!;

    [Required]
    public int DestinationAirportId { get; set; }
    [ForeignKey(nameof(DestinationAirportId))]
    public virtual Airport DestinationAirport { get; set; } = null!;

    [Required]
    public int AirlineId { get; set; }
    public virtual Airline Airline { get; set; } = null!;

    [Required]
    public int AircraftId { get; set; }
    public virtual Aircraft Aircraft { get; set; } = null!;

    public DateTime DepartureTime { get; set; }
    public DateTime ArrivalTime { get; set; }

    [StringLength(10)]
    public string? Terminal { get; set; }

    [StringLength(10)]
    public string? Gate { get; set; }

    public int TotalSeats { get; set; }
    public int SeatsAvailable { get; set; }

    [Column(TypeName = "decimal(12, 2)")]
    public decimal Price { get; set; }

    [Required]
    [StringLength(20)]
    public string Status { get; set; } = "SCHEDULED"; // SCHEDULED, ON_TIME, BOARDING, DELAYED, CANCELLED

    // Navigation collections
    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    public virtual ICollection<SeatAssignment> SeatAssignments { get; set; } = new List<SeatAssignment>();
}
```

### 3.2. `Booking.cs` (PNR Reservation)
```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AirportManagement.Core.Entities;

[Table("Bookings")]
public class Booking
{
    [Key]
    public int Id { get; set; }

    [Required]
    [StringLength(12)]
    public string BookingReference { get; set; } = string.Empty; // PNR Code: e.g. "BK-2026-8849"

    public int? UserId { get; set; }
    public virtual UserAccount? User { get; set; }

    [Required]
    public int FlightId { get; set; }
    public virtual Flight Flight { get; set; } = null!;

    public int? TourId { get; set; }
    public virtual Tour? Tour { get; set; }

    public int? CouponId { get; set; }
    public virtual Coupon? Coupon { get; set; }

    [Required]
    [StringLength(100)]
    public string CustomerName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [StringLength(100)]
    public string CustomerEmail { get; set; } = string.Empty;

    [Required]
    [Phone]
    [StringLength(20)]
    public string CustomerPhone { get; set; } = string.Empty;

    public int AdultsCount { get; set; } = 1;
    public int ChildrenCount { get; set; } = 0;

    [Column(TypeName = "decimal(12, 2)")]
    public decimal TotalPrice { get; set; }

    [Column(TypeName = "decimal(12, 2)")]
    public decimal DiscountAmount { get; set; } = 0.00m;

    [Required]
    [StringLength(20)]
    public string BookingStatus { get; set; } = "PENDING"; // PENDING, CONFIRMED, PAID, COMPLETED, CANCELLED

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation collections
    public virtual ICollection<Passenger> Passengers { get; set; } = new List<Passenger>();
    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
    public virtual ICollection<SeatAssignment> SeatAssignments { get; set; } = new List<SeatAssignment>();
}
```

### 3.3. `SeatAssignment.cs` (Check-In & Boarding Pass)
```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AirportManagement.Core.Entities;

[Table("SeatAssignments")]
public class SeatAssignment
{
    [Key]
    public int Id { get; set; }

    public int PassengerId { get; set; }
    public virtual Passenger Passenger { get; set; } = null!;

    public int FlightId { get; set; }
    public virtual Flight Flight { get; set; } = null!;

    public int SeatId { get; set; }
    public virtual Seat Seat { get; set; } = null!;

    public int BookingId { get; set; }
    public virtual Booking Booking { get; set; } = null!;

    [Required]
    [StringLength(5)]
    public string AssignedSeatNumber { get; set; } = string.Empty; // e.g., "14A"

    [StringLength(10)]
    public string? BoardingGroup { get; set; } // e.g., "Zone 2"

    public bool IsCheckedIn { get; set; } = false;
}
```

---

## 4. `AirportDbContext` & Fluent API Configuration

The DbContext manages entity configurations and enforces database constraints (unique PNRs, anti-double-booking constraints, and decimal precisions):

```csharp
using Microsoft.EntityFrameworkCore;
using AirportManagement.Core.Entities;

namespace AirportManagement.Infrastructure.Data;

public class AirportDbContext : DbContext
{
    public AirportDbContext(DbContextOptions<AirportDbContext> options) : base(options) { }

    public DbSet<Airport> Airports => Set<Airport>();
    public DbSet<Airline> Airlines => Set<Airline>();
    public DbSet<Aircraft> Aircraft => Set<Aircraft>();
    public DbSet<Seat> Seats => Set<Seat>();
    public DbSet<Flight> Flights => Set<Flight>();
    public DbSet<Destination> Destinations => Set<Destination>();
    public DbSet<Tour> Tours => Set<Tour>();
    public DbSet<ItineraryDay> ItineraryDays => Set<ItineraryDay>();
    public DbSet<UserAccount> Users => Set<UserAccount>();
    public DbSet<Booking> Bookings => Set<Booking>();
    public DbSet<Passenger> Passengers => Set<Passenger>();
    public DbSet<SeatAssignment> SeatAssignments => Set<SeatAssignment>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<Coupon> Coupons => Set<Coupon>();
    public DbSet<Article> Articles => Set<Article>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // 1. Airport unique codes
        modelBuilder.Entity<Airport>(entity =>
        {
            entity.HasIndex(e => e.IataCode).IsUnique();
            entity.HasIndex(e => e.IcaoCode).IsUnique();
        });

        // 2. Flight dual airport relationships
        modelBuilder.Entity<Flight>(entity =>
        {
            entity.HasOne(f => f.OriginAirport)
                  .WithMany()
                  .HasForeignKey(f => f.OriginAirportId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(f => f.DestinationAirport)
                  .WithMany()
                  .HasForeignKey(f => f.DestinationAirportId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // 3. Unique Booking PNR
        modelBuilder.Entity<Booking>(entity =>
        {
            entity.HasIndex(e => e.BookingReference).IsUnique();
        });

        // 4. Critical Anti-Double-Booking Constraint:
        // A single physical seat on a specific flight can only be assigned once!
        modelBuilder.Entity<SeatAssignment>(entity =>
        {
            entity.HasIndex(e => new { e.FlightId, e.SeatId }).IsUnique();
        });

        // 5. Unique Coupon Code & Article Slug
        modelBuilder.Entity<Coupon>().HasIndex(c => c.Code).IsUnique();
        modelBuilder.Entity<Article>().HasIndex(a => a.Slug).IsUnique();
    }
}
```

---

## 5. Migration & Database Setup Commands

### Step 1: Install EF Core NuGet Packages
```bash
# In AirportManagement.Infrastructure
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Microsoft.EntityFrameworkCore.Tools

# In AirportManagement.Api
dotnet add package Swashbuckle.AspNetCore
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
```

### Step 2: Configure Connection String (`appsettings.json`)
```json
{
  "ConnectionStrings": {
    "AirportDbConnection": "Server=localhost;Database=AirportManagementDb;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
  },
  "JwtSettings": {
    "Secret": "SUPER_SECRET_KEY_FOR_AIRPORT_DISPATCH_JWT_AUTH_2026",
    "Issuer": "AirportManagementApi",
    "Audience": "AirportManagementClients",
    "ExpiryMinutes": 1440
  }
}
```

### Step 3: Register in `Program.cs`
```csharp
builder.Services.AddDbContext<AirportDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("AirportDbConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowViteFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:5174")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});
```

### Step 4: Execute Migrations
```bash
# Generate the initial migration based on the 15 POCO entities
dotnet ef migrations add InitialCreate --project AirportManagement.Infrastructure --startup-project AirportManagement.Api

# Apply migrations to create database tables
dotnet ef database update --project AirportManagement.Infrastructure --startup-project AirportManagement.Api
```

---

## 6. RESTful API Endpoint Matrix

All endpoints follow REST principles with standard JSON responses:

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully",
  "total": 100
}
```

| Area | HTTP Method | Endpoint | Authorization | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/v1/auth/register` | Public | Register new passenger account |
| **Auth** | `POST` | `/api/v1/auth/login` | Public | Authenticate and obtain JWT token |
| **Auth** | `GET` | `/api/v1/auth/me` | User | Get current profile |
| **Flights** | `GET` | `/api/v1/flights` | Public | Search available flights (origin, dest, date) |
| **Flights** | `GET` | `/api/v1/flights/{id}` | Public | Flight detail with seat availability |
| **Flights** | `POST` | `/api/v1/flights` | Dispatcher / Admin | Create scheduled flight slot |
| **Flights** | `PATCH`| `/api/v1/flights/{id}/status` | Dispatcher / Admin | Update flight FIDS status |
| **Tours** | `GET` | `/api/v1/tours` | Public | List commercial tour packages |
| **Tours** | `GET` | `/api/v1/tours/{id}` | Public | Tour detail with itinerary days |
| **Tours** | `POST` | `/api/v1/tours` | Admin | Create/publish new tour package |
| **Destinations**| `GET` | `/api/v1/destinations` | Public | List airport-linked travel destinations |
| **Bookings**| `POST` | `/api/v1/bookings` | Public / User | Place new flight reservation (PNR issued) |
| **Bookings**| `GET` | `/api/v1/bookings/{reference}` | Public / User | Query booking by 6-char PNR |
| **Bookings**| `GET` | `/api/v1/bookings` | Admin / Dispatcher | List/filter all booking orders |
| **Seats** | `GET` | `/api/v1/flights/{id}/seats` | Public | Fetch physical seat map & occupancy |
| **Seats** | `POST` | `/api/v1/check-in/select-seat`| Public / User | Assign passenger seat during check-in |
| **Coupons** | `GET` | `/api/v1/coupons/validate/{code}` | Public | Validate discount code eligibility |
| **Articles**| `GET` | `/api/v1/articles` | Public | Airport guides & travel tips |
| **Analytics**| `GET` | `/api/v1/analytics/dashboard` | Admin | Dispatcher revenue, seat factor, status counts |
