using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class AirportDbContext : DbContext
{
    public AirportDbContext(DbContextOptions<AirportDbContext> options) : base(options)
    {
    }

    public DbSet<Airport> Airports => Set<Airport>();
    public DbSet<Airline> Airlines => Set<Airline>();
    public DbSet<Aircraft> Aircrafts => Set<Aircraft>();
    public DbSet<Seat> Seats => Set<Seat>();
    public DbSet<Destination> Destinations => Set<Destination>();
    public DbSet<Tour> Tours => Set<Tour>();
    public DbSet<ItineraryDay> ItineraryDays => Set<ItineraryDay>();
    public DbSet<Flight> Flights => Set<Flight>();
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
        modelBuilder.Entity<Airport>(b =>
        {
            b.HasIndex(a => a.IataCode).IsUnique();
            b.HasIndex(a => a.IcaoCode).IsUnique();
        });

        // 2. Airline unique codes
        modelBuilder.Entity<Airline>(b =>
        {
            b.HasIndex(a => a.IataCode).IsUnique();
        });

        // 3. Aircraft unique registration
        modelBuilder.Entity<Aircraft>(b =>
        {
            b.HasIndex(a => a.RegistrationNumber).IsUnique();
        });

        // 4. Flight dual airport relationships (avoid cascade cycle)
        modelBuilder.Entity<Flight>(b =>
        {
            b.HasOne(f => f.OriginAirport)
             .WithMany()
             .HasForeignKey(f => f.OriginAirportId)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasOne(f => f.DestinationAirport)
             .WithMany()
             .HasForeignKey(f => f.DestinationAirportId)
             .OnDelete(DeleteBehavior.Restrict);

            b.Property(f => f.Price)
             .HasPrecision(12, 2);
        });

        // 5. Booking PNR unique constraint & Decimal precisions
        modelBuilder.Entity<Booking>(b =>
        {
            b.HasIndex(e => e.BookingReference).IsUnique();
            b.Property(e => e.TotalPrice).HasPrecision(12, 2);
            b.Property(e => e.DiscountAmount).HasPrecision(12, 2);
        });

        // 6. Anti-Double-Booking Constraint:
        // A physical seat on a specific flight can only be occupied once
        modelBuilder.Entity<SeatAssignment>(b =>
        {
            b.HasIndex(sa => new { sa.FlightId, sa.SeatId }).IsUnique();
        });

        // 7. Tour precisions
        modelBuilder.Entity<Tour>(b =>
        {
            b.HasIndex(t => t.Code).IsUnique();
            b.Property(t => t.Price).HasPrecision(12, 2);
            b.Property(t => t.OriginalPrice).HasPrecision(12, 2);
        });

        // 8. Payment precisions
        modelBuilder.Entity<Payment>(b =>
        {
            b.Property(p => p.Amount).HasPrecision(12, 2);
        });

        // 9. Coupon unique code
        modelBuilder.Entity<Coupon>(b =>
        {
            b.HasIndex(c => c.Code).IsUnique();
            b.Property(c => c.DiscountPercent).HasPrecision(5, 2);
            b.Property(c => c.DiscountAmount).HasPrecision(12, 2);
            b.Property(c => c.MinSpend).HasPrecision(12, 2);
            b.Property(c => c.MaxDiscount).HasPrecision(12, 2);
        });

        // 10. Article unique slug
        modelBuilder.Entity<Article>(b =>
        {
            b.HasIndex(a => a.Slug).IsUnique();
        });
    }
}
