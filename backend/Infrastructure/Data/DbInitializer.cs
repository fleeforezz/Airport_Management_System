using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public static class DbInitializer
{
    public static async Task InitializeAsync(AirportDbContext context)
    {
        // Check if database exists, create if not
        await context.Database.EnsureCreatedAsync();

        if (await context.Airports.AnyAsync())
        {
            return; // DB has been seeded
        }

        // 1. Seed Airports
        var airports = new List<Airport>
        {
            new() { IataCode = "SGN", IcaoCode = "VVTS", Name = "Tan Son Nhat International Airport", City = "Ho Chi Minh City", Country = "Vietnam", Timezone = "Asia/Ho_Chi_Minh" },
            new() { IataCode = "DAD", IcaoCode = "VVRG", Name = "Da Nang International Airport", City = "Da Nang", Country = "Vietnam", Timezone = "Asia/Ho_Chi_Minh" },
            new() { IataCode = "HAN", IcaoCode = "VVNB", Name = "Noi Bai International Airport", City = "Ha Noi", Country = "Vietnam", Timezone = "Asia/Ho_Chi_Minh" },
            new() { IataCode = "JFK", IcaoCode = "KJFK", Name = "John F. Kennedy International Airport", City = "New York", Country = "United States", Timezone = "America/New_York" },
            new() { IataCode = "NRT", IcaoCode = "RJAA", Name = "Narita International Airport", City = "Tokyo", Country = "Japan", Timezone = "Asia/Tokyo" }
        };
        await context.Airports.AddRangeAsync(airports);
        await context.SaveChangesAsync();

        // 2. Seed Airlines
        var airlines = new List<Airline>
        {
            new() { IataCode = "VN", IcaoCode = "HVN", Name = "Vietnam Airlines", Country = "Vietnam", LogoUrl = "https://images.unsplash.com/photo-1542296332-2e4473faf563" },
            new() { IataCode = "VJ", IcaoCode = "VJC", Name = "Vietjet Air", Country = "Vietnam", LogoUrl = "https://images.unsplash.com/photo-1569154941061-e231b4725ef1" },
            new() { IataCode = "QH", IcaoCode = "BAV", Name = "Bamboo Airways", Country = "Vietnam", LogoUrl = "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf" }
        };
        await context.Airlines.AddRangeAsync(airlines);
        await context.SaveChangesAsync();

        // 3. Seed Aircrafts
        var aircrafts = new List<Aircraft>
        {
            new() { AirlineId = airlines[0].Id, RegistrationNumber = "VN-A899", Model = "Airbus A350-900", Capacity = 305, Status = "ACTIVE" },
            new() { AirlineId = airlines[0].Id, RegistrationNumber = "VN-A688", Model = "Boeing 787-9 Dreamliner", Capacity = 274, Status = "ACTIVE" },
            new() { AirlineId = airlines[1].Id, RegistrationNumber = "VN-A321", Model = "Airbus A321neo", Capacity = 230, Status = "ACTIVE" }
        };
        await context.Aircrafts.AddRangeAsync(aircrafts);
        await context.SaveChangesAsync();

        // 4. Seed Physical Seats for VN-A899
        var seats = new List<Seat>();
        string[] rows = { "1", "2", "3", "11", "12", "14", "15", "16", "17", "18", "19", "20" };
        string[] cols = { "A", "B", "C", "D", "E", "F" };

        foreach (var r in rows)
        {
            bool isBiz = int.Parse(r) <= 3;
            bool isExit = r == "14";
            string travelClass = isBiz ? "BUSINESS" : (isExit ? "PREMIUM_ECONOMY" : "ECONOMY");

            foreach (var c in cols)
            {
                seats.Add(new Seat
                {
                    AircraftId = aircrafts[0].Id,
                    SeatNumber = $"{r}{c}",
                    TravelClass = travelClass,
                    IsExitRow = isExit
                });
            }
        }
        await context.Seats.AddRangeAsync(seats);
        await context.SaveChangesAsync();

        // 5. Seed Destinations
        var destinations = new List<Destination>
        {
            new()
            {
                AirportId = airports[1].Id,
                Code = "DAD",
                Name = "Da Nang",
                City = "Da Nang",
                Country = "Vietnam",
                ImageUrl = "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b",
                Description = "Coastal paradise with world-renowned beaches, the Golden Bridge, and modern flight corridors.",
                Climate = "Tropical Savanna (25C - 32C)",
                BestTimeToVisit = "Feb - Aug",
                PopularToursCount = 8
            },
            new()
            {
                AirportId = airports[4].Id,
                Code = "NRT",
                Name = "Tokyo",
                City = "Tokyo",
                Country = "Japan",
                ImageUrl = "https://images.unsplash.com/photo-1503899036084-c55cdd92da26",
                Description = "A futuristic aviation capital seamlessly blending cutting-edge neon districts with sacred Shinto shrines.",
                Climate = "Temperate (10C - 26C)",
                BestTimeToVisit = "Mar - May, Sep - Nov",
                PopularToursCount = 14
            },
            new()
            {
                AirportId = airports[3].Id,
                Code = "JFK",
                Name = "New York",
                City = "New York",
                Country = "United States",
                ImageUrl = "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9",
                Description = "Global commercial and culture hub connected through JFK International Terminal 4 corridor.",
                Climate = "Humid Continental (2C - 28C)",
                BestTimeToVisit = "Apr - Jun, Sep - Nov",
                PopularToursCount = 6
            }
        };
        await context.Destinations.AddRangeAsync(destinations);
        await context.SaveChangesAsync();

        // 6. Seed Tours
        var tours = new List<Tour>
        {
            new()
            {
                DestinationId = destinations[0].Id,
                AirlineId = airlines[0].Id,
                Code = "VN-DAD-01",
                Title = "Da Nang Coast & Golden Bridge Aviation Tour",
                Subtitle = "Direct Flight + 5-Star Oceanfront Resort + Ba Na Hills Access",
                Price = 320.00m,
                OriginalPrice = 399.00m,
                DurationDays = 3,
                DurationNights = 2,
                DepartureCity = "Ho Chi Minh City",
                TransportType = "FLIGHT",
                FeaturedImage = "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b",
                GalleryImagesJson = "[\"https://images.unsplash.com/photo-1559592413-7cec4d0cae2b\",\"https://images.unsplash.com/photo-1540959733332-eab4deabeeaf\"]",
                HighlightsJson = "[\"Priority check-in at Tan Son Nhat (SGN) T2\",\"Direct scheduled flight on Airbus A350\",\"Private airport chauffeur transfer\",\"Full Ba Na Hills & Golden Bridge access\"]",
                Rating = 4.9,
                ReviewsCount = 128,
                Status = "ACTIVE"
            },
            new()
            {
                DestinationId = destinations[1].Id,
                AirlineId = airlines[0].Id,
                Code = "VN-NRT-01",
                Title = "Tokyo Express & Mt. Fuji Aviation Explorer",
                Subtitle = "Widebody Flight Corridor + Shinjuku Hotel + Shinkansen Pass",
                Price = 890.00m,
                OriginalPrice = 1050.00m,
                DurationDays = 5,
                DurationNights = 4,
                DepartureCity = "Ho Chi Minh City",
                TransportType = "FLIGHT",
                FeaturedImage = "https://images.unsplash.com/photo-1503899036084-c55cdd92da26",
                GalleryImagesJson = "[\"https://images.unsplash.com/photo-1503899036084-c55cdd92da26\"]",
                HighlightsJson = "[\"Trans-Asian widebody flight on Boeing 787\",\"Shinjuku executive business hotel stay\",\"Round-trip Narita Skyliner express tickets\"]",
                Rating = 4.8,
                ReviewsCount = 94,
                Status = "ACTIVE"
            }
        };
        await context.Tours.AddRangeAsync(tours);
        await context.SaveChangesAsync();

        // 7. Seed Itinerary Days
        var days = new List<ItineraryDay>
        {
            new()
            {
                TourId = tours[0].Id,
                DayNumber = 1,
                Title = "SGN Flight Slot & Oceanfront Check-In",
                Description = "Depart SGN on flight VN-124. Land at Da Nang DAD, private luxury car transfer to My Khe beach resort.",
                ActivitiesJson = "[\"Airport VIP lounge access at SGN\",\"Flight VN-124 departure\",\"Resort check-in & seaside sunset\"]",
                Meals = "Dinner included",
                Stay = "Pullman Danang Beach Resort"
            },
            new()
            {
                TourId = tours[0].Id,
                DayNumber = 2,
                Title = "Ba Na Hills & Golden Hand Bridge",
                Description = "Cable car ride to Ba Na summit, walk the world-famous Golden Bridge, French Village sightseeing.",
                ActivitiesJson = "[\"World-record cable car ascent\",\"Golden Bridge photo session\",\"French Village & Fantasy Park\"]",
                Meals = "Breakfast, Buffet lunch",
                Stay = "Pullman Danang Beach Resort"
            },
            new()
            {
                TourId = tours[0].Id,
                DayNumber = 3,
                Title = "Son Tra Peninsula & Return Flight",
                Description = "Linh Ung Pagoda visit, Han Market duty-free shopping, return flight from DAD to SGN.",
                ActivitiesJson = "[\"Son Tra scenic drive\",\"Market shopping & seafood\",\"Flight VN-129 back to SGN\"]",
                Meals = "Breakfast included",
                Stay = "Transit"
            }
        };
        await context.ItineraryDays.AddRangeAsync(days);
        await context.SaveChangesAsync();

        // 8. Seed Scheduled Flight Slots (Departures)
        var now = DateTime.UtcNow;
        var flights = new List<Flight>
        {
            new()
            {
                TourId = tours[0].Id,
                OriginAirportId = airports[0].Id,
                DestinationAirportId = airports[1].Id,
                AirlineId = airlines[0].Id,
                AircraftId = aircrafts[0].Id,
                FlightNumber = "VN-124",
                DepartureTime = now.AddHours(2),
                ArrivalTime = now.AddHours(3).AddMinutes(20),
                Terminal = "T2",
                Gate = "G12",
                TotalSeats = 305,
                SeatsAvailable = 284,
                Price = 120.00m,
                Status = "ON_TIME"
            },
            new()
            {
                TourId = tours[0].Id,
                OriginAirportId = airports[0].Id,
                DestinationAirportId = airports[1].Id,
                AirlineId = airlines[0].Id,
                AircraftId = aircrafts[0].Id,
                FlightNumber = "VN-128",
                DepartureTime = now.AddHours(6),
                ArrivalTime = now.AddHours(7).AddMinutes(20),
                Terminal = "T2",
                Gate = "G08",
                TotalSeats = 305,
                SeatsAvailable = 300,
                Price = 135.00m,
                Status = "SCHEDULED"
            },
            new()
            {
                TourId = tours[1].Id,
                OriginAirportId = airports[0].Id,
                DestinationAirportId = airports[4].Id,
                AirlineId = airlines[0].Id,
                AircraftId = aircrafts[1].Id,
                FlightNumber = "VN-300",
                DepartureTime = now.AddHours(8),
                ArrivalTime = now.AddHours(13).AddMinutes(30),
                Terminal = "T2",
                Gate = "G24",
                TotalSeats = 274,
                SeatsAvailable = 198,
                Price = 450.00m,
                Status = "BOARDING"
            }
        };
        await context.Flights.AddRangeAsync(flights);
        await context.SaveChangesAsync();

        // 9. Seed Users
        var adminUser = new UserAccount
        {
            Username = "dispatcher_admin",
            Email = "admin@airport.gov",
            PasswordHash = "admin123_hash",
            FullName = "Chief Flight Dispatcher",
            Phone = "+84 909 123 456",
            Role = "ADMIN",
            CreatedAt = now
        };
        var passengerUser = new UserAccount
        {
            Username = "alex_traveler",
            Email = "alex@gmail.com",
            PasswordHash = "user123_hash",
            FullName = "Alex Nguyen",
            Phone = "+84 918 888 999",
            Role = "USER",
            CreatedAt = now
        };
        await context.Users.AddRangeAsync(new[] { adminUser, passengerUser });
        await context.SaveChangesAsync();

        // 10. Seed Bookings
        var sampleBooking = new Booking
        {
            BookingReference = "BK-2026-8849",
            UserId = passengerUser.Id,
            FlightId = flights[0].Id,
            TourId = tours[0].Id,
            Route = "SGN -> DAD",
            CustomerName = "Alex Nguyen",
            CustomerEmail = "alex@gmail.com",
            CustomerPhone = "+84 918 888 999",
            AdultsCount = 1,
            ChildrenCount = 0,
            TotalPrice = 320.00m,
            DiscountAmount = 0.00m,
            PaymentMethod = "CREDIT_CARD",
            BookingStatus = "PAID",
            Notes = "Window seat requested",
            CreatedAt = now.AddHours(-1)
        };
        await context.Bookings.AddAsync(sampleBooking);
        await context.SaveChangesAsync();

        // 11. Seed Passenger & Seat Assignment
        var passenger = new Passenger
        {
            BookingId = sampleBooking.Id,
            FullName = "Alex Nguyen",
            IdOrPassport = "B12345678",
            Gender = "MALE",
            PassengerType = "ADULT",
            SelectedSeat = "14A"
        };
        await context.Passengers.AddAsync(passenger);
        await context.SaveChangesAsync();

        var seat14A = seats.First(s => s.SeatNumber == "14A");
        await context.SeatAssignments.AddAsync(new SeatAssignment
        {
            PassengerId = passenger.Id,
            FlightId = flights[0].Id,
            SeatId = seat14A.Id,
            BookingId = sampleBooking.Id,
            AssignedSeatNumber = "14A",
            BoardingGroup = "Zone 1",
            IsCheckedIn = true
        });

        // 12. Seed Coupons
        var coupons = new List<Coupon>
        {
            new()
            {
                Code = "FLYSUMMER",
                Description = "Summer aviation discount - 10% off total booking",
                DiscountPercent = 10.00m,
                MinSpend = 200.00m,
                MaxDiscount = 50.00m,
                ValidUntil = now.AddMonths(6),
                UsageCount = 18,
                IsActive = true
            },
            new()
            {
                Code = "AIRPORT25",
                Description = "Flat $25 off any domestic flight package",
                DiscountAmount = 25.00m,
                MinSpend = 100.00m,
                ValidUntil = now.AddMonths(3),
                UsageCount = 42,
                IsActive = true
            }
        };
        await context.Coupons.AddRangeAsync(coupons);

        // 13. Seed Articles
        var articles = new List<Article>
        {
            new()
            {
                AuthorId = adminUser.Id,
                Slug = "airport-transit-guide-2026",
                Title = "Complete Tan Son Nhat (SGN) Transit & Fast-Track Guide",
                Summary = "How to navigate Terminal 2 check-in, priority security lanes, and business lounges with ease.",
                Content = "Tan Son Nhat International Airport Terminal 2 handles over 25 million passengers annually. For seamless transit, ensure your baggage tags reflect your final destination...",
                CoverImage = "https://images.unsplash.com/photo-1542296332-2e4473faf563",
                AuthorName = "Chief Flight Dispatcher",
                Category = "AIRPORT_GUIDE",
                ReadTimeMinutes = 4,
                TagsJson = "[\"Airport Guide\",\"SGN\",\"Transit\",\"Lounges\"]",
                PublishedAt = now.AddDays(-2)
            },
            new()
            {
                AuthorId = adminUser.Id,
                Slug = "carry-on-luggage-regulations",
                Title = "2026 IATA Aviation Baggage & Battery Regulations",
                Summary = "Essential checklist of prohibited items, lithium power bank caps, and carry-on dimensions.",
                Content = "International civil aviation regulations strictly mandate that all spare lithium-ion power banks must be carried in cabin baggage...",
                CoverImage = "https://images.unsplash.com/photo-1569154941061-e231b4725ef1",
                AuthorName = "Chief Flight Dispatcher",
                Category = "FLIGHT_TIPS",
                ReadTimeMinutes = 6,
                TagsJson = "[\"Luggage\",\"Safety\",\"IATA\",\"Batteries\"]",
                PublishedAt = now.AddDays(-5)
            }
        };
        await context.Articles.AddRangeAsync(articles);

        await context.SaveChangesAsync();
    }
}
