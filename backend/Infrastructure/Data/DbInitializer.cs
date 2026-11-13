using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public static class DbInitializer
{
    public static async Task InitializeAsync(AirportDbContext context)
    {
        // 0. Ensure schema is created
        await context.Database.EnsureCreatedAsync();

        var now = DateTime.UtcNow;

        // =====================================================================
        // 1. SEED AIRPORTS (Civil Aviation Hubs)
        // =====================================================================
        var existingAirports = await context.Airports.ToListAsync();
        var airportMap = existingAirports.ToDictionary(a => a.IataCode, a => a);

        var airportSeeds = new List<Airport>
        {
            new() { IataCode = "SGN", IcaoCode = "VVTS", Name = "Tan Son Nhat International Airport", City = "Ho Chi Minh City", Country = "Vietnam", Timezone = "Asia/Ho_Chi_Minh" },
            new() { IataCode = "DAD", IcaoCode = "VVRG", Name = "Da Nang International Airport", City = "Da Nang", Country = "Vietnam", Timezone = "Asia/Ho_Chi_Minh" },
            new() { IataCode = "HAN", IcaoCode = "VVNB", Name = "Noi Bai International Airport", City = "Ha Noi", Country = "Vietnam", Timezone = "Asia/Ho_Chi_Minh" },
            new() { IataCode = "PQC", IcaoCode = "VVPQ", Name = "Phu Quoc International Airport", City = "Phu Quoc", Country = "Vietnam", Timezone = "Asia/Ho_Chi_Minh" },
            new() { IataCode = "CXR", IcaoCode = "VVCR", Name = "Cam Ranh International Airport", City = "Nha Trang", Country = "Vietnam", Timezone = "Asia/Ho_Chi_Minh" },
            new() { IataCode = "VDO", IcaoCode = "VVVD", Name = "Van Don International Airport", City = "Quang Ninh", Country = "Vietnam", Timezone = "Asia/Ho_Chi_Minh" },
            new() { IataCode = "DLI", IcaoCode = "VVDL", Name = "Lien Khuong Airport", City = "Da Lat", Country = "Vietnam", Timezone = "Asia/Ho_Chi_Minh" },
            new() { IataCode = "UIH", IcaoCode = "VVPC", Name = "Phu Cat Airport", City = "Quy Nhon", Country = "Vietnam", Timezone = "Asia/Ho_Chi_Minh" },
            new() { IataCode = "HUI", IcaoCode = "VVPB", Name = "Phu Bai International Airport", City = "Hue", Country = "Vietnam", Timezone = "Asia/Ho_Chi_Minh" },
            new() { IataCode = "VCS", IcaoCode = "VVCS", Name = "Con Dao Airport", City = "Con Dao", Country = "Vietnam", Timezone = "Asia/Ho_Chi_Minh" },
            new() { IataCode = "NRT", IcaoCode = "RJAA", Name = "Narita International Airport", City = "Tokyo", Country = "Japan", Timezone = "Asia/Tokyo" },
            new() { IataCode = "KIX", IcaoCode = "RJBB", Name = "Kansai International Airport", City = "Osaka", Country = "Japan", Timezone = "Asia/Tokyo" },
            new() { IataCode = "ICN", IcaoCode = "RKSI", Name = "Incheon International Airport", City = "Seoul", Country = "South Korea", Timezone = "Asia/Seoul" },
            new() { IataCode = "SIN", IcaoCode = "WSSS", Name = "Singapore Changi Airport", City = "Singapore", Country = "Singapore", Timezone = "Asia/Singapore" },
            new() { IataCode = "BKK", IcaoCode = "VTBS", Name = "Suvarnabhumi Airport", City = "Bangkok", Country = "Thailand", Timezone = "Asia/Bangkok" },
            new() { IataCode = "DPS", IcaoCode = "WADD", Name = "Ngurah Rai International Airport", City = "Bali", Country = "Indonesia", Timezone = "Asia/Makassar" },
            new() { IataCode = "TPE", IcaoCode = "RCTP", Name = "Taiwan Taoyuan International Airport", City = "Taipei", Country = "Taiwan", Timezone = "Asia/Taipei" },
            new() { IataCode = "HKG", IcaoCode = "VHHH", Name = "Hong Kong International Airport", City = "Hong Kong", Country = "Hong Kong", Timezone = "Asia/Hong_Kong" },
            new() { IataCode = "CDG", IcaoCode = "LFPG", Name = "Charles de Gaulle Airport", City = "Paris", Country = "France", Timezone = "Europe/Paris" },
            new() { IataCode = "JFK", IcaoCode = "KJFK", Name = "John F. Kennedy International Airport", City = "New York", Country = "United States", Timezone = "America/New_York" }
        };

        foreach (var seed in airportSeeds)
        {
            if (!airportMap.TryGetValue(seed.IataCode, out var existing))
            {
                await context.Airports.AddAsync(seed);
                airportMap[seed.IataCode] = seed;
            }
        }
        await context.SaveChangesAsync();

        // Reload fresh map
        existingAirports = await context.Airports.ToListAsync();
        airportMap = existingAirports.ToDictionary(a => a.IataCode, a => a);

        // =====================================================================
        // 2. SEED AIRLINES (Fleet Carriers)
        // =====================================================================
        var existingAirlines = await context.Airlines.ToListAsync();
        var airlineMap = existingAirlines.ToDictionary(a => a.IataCode, a => a);

        var airlineSeeds = new List<Airline>
        {
            new() { IataCode = "VN", IcaoCode = "HVN", Name = "Vietnam Airlines", Country = "Vietnam", LogoUrl = "https://images.unsplash.com/photo-1542296332-2e4473faf563" },
            new() { IataCode = "VJ", IcaoCode = "VJC", Name = "Vietjet Air", Country = "Vietnam", LogoUrl = "https://images.unsplash.com/photo-1569154941061-e231b4725ef1" },
            new() { IataCode = "QH", IcaoCode = "BAV", Name = "Bamboo Airways", Country = "Vietnam", LogoUrl = "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf" },
            new() { IataCode = "SQ", IcaoCode = "SIA", Name = "Singapore Airlines", Country = "Singapore", LogoUrl = "https://images.unsplash.com/photo-1570125909232-eb263c188f7e" },
            new() { IataCode = "JL", IcaoCode = "JAL", Name = "Japan Airlines", Country = "Japan", LogoUrl = "https://images.unsplash.com/photo-1503899036084-c55cdd92da26" },
            new() { IataCode = "AF", IcaoCode = "AFR", Name = "Air France", Country = "France", LogoUrl = "https://images.unsplash.com/photo-1502602898657-3e91760cbb34" }
        };

        foreach (var seed in airlineSeeds)
        {
            if (!airlineMap.TryGetValue(seed.IataCode, out var existing))
            {
                await context.Airlines.AddAsync(seed);
                airlineMap[seed.IataCode] = seed;
            }
        }
        await context.SaveChangesAsync();

        existingAirlines = await context.Airlines.ToListAsync();
        airlineMap = existingAirlines.ToDictionary(a => a.IataCode, a => a);

        // =====================================================================
        // 3. SEED AIRCRAFTS & SEATS
        // =====================================================================
        var existingAircrafts = await context.Aircrafts.ToListAsync();
        var aircraftMap = existingAircrafts.ToDictionary(a => a.RegistrationNumber, a => a);

        var aircraftSeeds = new List<Aircraft>
        {
            new() { AirlineId = airlineMap["VN"].Id, RegistrationNumber = "VN-A899", Model = "Airbus A350-900", Capacity = 305, Status = "ACTIVE" },
            new() { AirlineId = airlineMap["VN"].Id, RegistrationNumber = "VN-A688", Model = "Boeing 787-9 Dreamliner", Capacity = 274, Status = "ACTIVE" },
            new() { AirlineId = airlineMap["VJ"].Id, RegistrationNumber = "VN-A321", Model = "Airbus A321neo", Capacity = 230, Status = "ACTIVE" },
            new() { AirlineId = airlineMap["QH"].Id, RegistrationNumber = "VN-A888", Model = "Boeing 787-9 Dreamliner", Capacity = 294, Status = "ACTIVE" },
            new() { AirlineId = airlineMap["SQ"].Id, RegistrationNumber = "9V-SWB", Model = "Boeing 777-300ER", Capacity = 264, Status = "ACTIVE" },
            new() { AirlineId = airlineMap["AF"].Id, RegistrationNumber = "F-GSQA", Model = "Boeing 777-300ER", Capacity = 296, Status = "ACTIVE" }
        };

        foreach (var seed in aircraftSeeds)
        {
            if (!aircraftMap.TryGetValue(seed.RegistrationNumber, out var existing))
            {
                await context.Aircrafts.AddAsync(seed);
                aircraftMap[seed.RegistrationNumber] = seed;
            }
        }
        await context.SaveChangesAsync();

        existingAircrafts = await context.Aircrafts.ToListAsync();
        aircraftMap = existingAircrafts.ToDictionary(a => a.RegistrationNumber, a => a);

        // Seed Physical Seats for VN-A899 if seats are few
        if (await context.Seats.CountAsync() < 30)
        {
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
                        AircraftId = aircraftMap["VN-A899"].Id,
                        SeatNumber = $"{r}{c}",
                        TravelClass = travelClass,
                        IsExitRow = isExit
                    });
                }
            }
            await context.Seats.AddRangeAsync(seats);
            await context.SaveChangesAsync();
        }

        // =====================================================================
        // 4. SEED DESTINATIONS
        // =====================================================================
        var existingDestinations = await context.Destinations.ToListAsync();
        var destMap = existingDestinations.ToDictionary(d => d.Code, d => d);

        var destinationSeeds = new List<Destination>
        {
            new()
            {
                AirportId = airportMap["DAD"].Id,
                Code = "DAD",
                Name = "Đà Nẵng & Hội An",
                City = "Đà Nẵng",
                Country = "Việt Nam",
                ImageUrl = "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80",
                Description = "Thiên đường biển miền Trung với Cầu Vàng Bà Nà Hills, biển Mỹ Khê và di sản phố cổ Hội An lân cận.",
                Climate = "Nhiệt đới gió mùa (25°C - 32°C)",
                BestTimeToVisit = "Tháng 2 - Tháng 8",
                PopularToursCount = 12
            },
            new()
            {
                AirportId = airportMap["PQC"].Id,
                Code = "PQC",
                Name = "Phú Quốc Đảo Ngọc",
                City = "Kiên Giang",
                Country = "Việt Nam",
                ImageUrl = "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80",
                Description = "Đảo ngọc nghỉ dưỡng hàng đầu với bãi sao cát trắng, hoàng hôn Sunset Sanato và cáp treo Hòn Thơm vượt biển.",
                Climate = "Nhiệt đới biển đảo (26°C - 30°C)",
                BestTimeToVisit = "Tháng 10 - Tháng 5",
                PopularToursCount = 10
            },
            new()
            {
                AirportId = airportMap["CXR"].Id,
                Code = "CXR",
                Name = "Nha Trang Vịnh Ngọc",
                City = "Khánh Hòa",
                Country = "Việt Nam",
                ImageUrl = "https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=1200&q=80",
                Description = "Vịnh biển ngọc ngà nhiệt đới, lặn ngắm san hô Hòn Mun, đảo VinWonders và suối khoáng nóng thư giãn.",
                Climate = "Ôn hòa ven biển (24°C - 29°C)",
                BestTimeToVisit = "Tháng 1 - Tháng 9",
                PopularToursCount = 8
            },
            new()
            {
                AirportId = airportMap["HAN"].Id,
                Code = "HAN",
                Name = "Hà Nội Ngàn Năm Văn Hiến",
                City = "Hà Nội",
                Country = "Việt Nam",
                ImageUrl = "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80",
                Description = "Thủ đô ngàn năm văn hiến với 36 phố phường, Hồ Gươm cổ kính và văn hóa ẩm thực truyền thống trứ danh.",
                Climate = "Bốn mùa rõ rệt (16°C - 31°C)",
                BestTimeToVisit = "Tháng 9 - Tháng 4",
                PopularToursCount = 14
            },
            new()
            {
                AirportId = airportMap["VDO"].Id,
                Code = "VDO",
                Name = "Hạ Long & Vân Đồn",
                City = "Quảng Ninh",
                Country = "Việt Nam",
                ImageUrl = "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
                Description = "Kỳ quan thiên nhiên thế giới Vịnh Hạ Long, du thuyền thượng lưu 6 sao và bến cảng Vân Đồn hiện đại.",
                Climate = "Cận nhiệt đới gió mùa (17°C - 30°C)",
                BestTimeToVisit = "Tháng 3 - Tháng 10",
                PopularToursCount = 9
            },
            new()
            {
                AirportId = airportMap["SGN"].Id,
                Code = "SGN",
                Name = "TP. Hồ Chí Minh Đại Đô Thị",
                City = "TP. Hồ Chí Minh",
                Country = "Việt Nam",
                ImageUrl = "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80",
                Description = "Đại đô thị năng động bậc nhất phương Nam với nhịp sống hiện đại, ẩm thực đường phố và di tích lịch sử.",
                Climate = "Nhiệt đới gió mùa (26°C - 34°C)",
                BestTimeToVisit = "Tháng 12 - Tháng 4",
                PopularToursCount = 12
            },
            new()
            {
                AirportId = airportMap["DLI"].Id,
                Code = "DLI",
                Name = "Đà Lạt Ngàn Hoa",
                City = "Lâm Đồng",
                Country = "Việt Nam",
                ImageUrl = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
                Description = "Thành phố sương mù mộng mơ, đồi thông bạt ngàn, thác nước hùng vĩ và khí hậu mát mẻ quanh năm.",
                Climate = "Ôn đới núi cao (14°C - 23°C)",
                BestTimeToVisit = "Tháng 10 - Tháng 3",
                PopularToursCount = 10
            },
            new()
            {
                AirportId = airportMap["UIH"].Id,
                Code = "UIH",
                Name = "Quy Nhơn Eo Gió & Kỳ Co",
                City = "Bình Định",
                Country = "Việt Nam",
                ImageUrl = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
                Description = "Vùng biển hoang sơ tuyệt mỹ với Eo Gió hùng vĩ, bãi tắm Kỳ Co nước trong như ngọc bích.",
                Climate = "Nhiệt đới hải dương (24°C - 32°C)",
                BestTimeToVisit = "Tháng 3 - Tháng 9",
                PopularToursCount = 7
            },
            new()
            {
                AirportId = airportMap["HUI"].Id,
                Code = "HUI",
                Name = "Huế Cố Đô Di Sản",
                City = "Thừa Thiên Huế",
                Country = "Việt Nam",
                ImageUrl = "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
                Description = "Kinh thành triều Nguyễn cổ kính, lăng tẩm uy nghiêm, sông Hương thơ mộng và ẩm thực cung đình đặc sắc.",
                Climate = "Nhiệt đới gió mùa (20°C - 33°C)",
                BestTimeToVisit = "Tháng 1 - Tháng 4",
                PopularToursCount = 8
            },
            new()
            {
                AirportId = airportMap["VCS"].Id,
                Code = "VCS",
                Name = "Côn Đảo Thiên Đường Biển Bí Ẩn",
                City = "Bà Rịa - Vũng Tàu",
                Country = "Việt Nam",
                ImageUrl = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80",
                Description = "Quần đảo linh thiêng và nguyên sơ với bãi Đầm Trầu cát vàng, lặn biển ngắm rùa đẻ trứng và san hô rực rỡ.",
                Climate = "Hải dương nhiệt đới (26°C - 31°C)",
                BestTimeToVisit = "Tháng 3 - Tháng 9",
                PopularToursCount = 6
            },
            new()
            {
                AirportId = airportMap["NRT"].Id,
                Code = "NRT",
                Name = "Tokyo & Núi Phú Sĩ",
                City = "Tokyo",
                Country = "Nhật Bản",
                ImageUrl = "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
                Description = "Đại đô thị tương lai pha trộn giữa các trung tâm công nghệ Shinjuku, Shibuya và đỉnh núi Phú Sĩ tuyết phủ.",
                Climate = "Ôn đới (10°C - 26°C)",
                BestTimeToVisit = "Tháng 3 - Tháng 5, Tháng 9 - Tháng 11",
                PopularToursCount = 18
            },
            new()
            {
                AirportId = airportMap["KIX"].Id,
                Code = "KIX",
                Name = "Osaka & Cố Đô Kyoto",
                City = "Osaka / Kyoto",
                Country = "Nhật Bản",
                ImageUrl = "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
                Description = "Trái tim văn hóa Nhật Bản với chùa Vàng Kinkaku-ji, rừng trúc Arashiyama và thiên đường ẩm thực Dotonbori.",
                Climate = "Ôn đới bốn mùa (9°C - 28°C)",
                BestTimeToVisit = "Tháng 3 - Tháng 5, Tháng 10 - Tháng 12",
                PopularToursCount = 11
            },
            new()
            {
                AirportId = airportMap["ICN"].Id,
                Code = "ICN",
                Name = "Seoul & Cung Điện Hoàng Gia",
                City = "Seoul",
                Country = "Hàn Quốc",
                ImageUrl = "https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=1200&q=80",
                Description = "Thủ phủ thời trang K-Wave, Cung điện Hoàng gia Gyeongbokgung nguy nga và đảo Nami ngập tràn sắc lá vàng.",
                Climate = "Ôn đới lục địa (8°C - 24°C)",
                BestTimeToVisit = "Tháng 3 - Tháng 5, Tháng 9 - Tháng 11",
                PopularToursCount = 15
            },
            new()
            {
                AirportId = airportMap["SIN"].Id,
                Code = "SIN",
                Name = "Singapore Đảo Quốc Sư Tử",
                City = "Singapore",
                Country = "Singapore",
                ImageUrl = "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80",
                Description = "Đảo quốc sư tử xanh sạch nhất thế giới, kỳ quan Marina Bay Sands và thác nước trong nhà Jewel Changi huyền thoại.",
                Climate = "Xích đạo nhiệt đới (26°C - 32°C)",
                BestTimeToVisit = "Quanh năm",
                PopularToursCount = 11
            },
            new()
            {
                AirportId = airportMap["BKK"].Id,
                Code = "BKK",
                Name = "Bangkok Xứ Sở Chùa Vàng",
                City = "Bangkok",
                Country = "Thái Lan",
                ImageUrl = "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80",
                Description = "Thủ đô Bangkok náo nhiệt với hoàng cung lộng lẫy, du thuyền Chao Phraya và ẩm thực đường phố độc đáo.",
                Climate = "Nhiệt đới ẩm (27°C - 35°C)",
                BestTimeToVisit = "Tháng 11 - Tháng 2",
                PopularToursCount = 14
            },
            new()
            {
                AirportId = airportMap["DPS"].Id,
                Code = "DPS",
                Name = "Bali Thiên Đường Nhiệt Đới",
                City = "Bali",
                Country = "Indonesia",
                ImageUrl = "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
                Description = "Hòn đảo của các vị thần với ruộng bậc thang Tegallalang, cổng trời Lempuyang và hoàng hôn bãi biển Jimbaran.",
                Climate = "Nhiệt đới biển (25°C - 31°C)",
                BestTimeToVisit = "Tháng 4 - Tháng 10",
                PopularToursCount = 9
            },
            new()
            {
                AirportId = airportMap["TPE"].Id,
                Code = "TPE",
                Name = "Đài Bắc & Làng Cổ Cửu Phần",
                City = "Đài Bắc",
                Country = "Đài Loan",
                ImageUrl = "https://images.unsplash.com/photo-1508247967583-7d982ea01526?auto=format&fit=crop&w=1200&q=80",
                Description = "Tháp Taipei 101 biểu tượng, chợ đêm Shilin sầm uất và làng cổ Cửu Phần Jiufen lung linh đèn lồng đỏ.",
                Climate = "Cận nhiệt đới hải dương (18°C - 30°C)",
                BestTimeToVisit = "Tháng 10 - Tháng 4",
                PopularToursCount = 8
            },
            new()
            {
                AirportId = airportMap["HKG"].Id,
                Code = "HKG",
                Name = "Hồng Kông Cảng Victoria & Đỉnh The Peak",
                City = "Hồng Kông",
                Country = "Hồng Kông",
                ImageUrl = "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80",
                Description = "Đại đô thị cảng sầm uất với show ánh sáng Symphony of Lights vịnh Victoria và Disneyland thần tiên.",
                Climate = "Cận nhiệt đới gió mùa (17°C - 31°C)",
                BestTimeToVisit = "Tháng 10 - Tháng 12",
                PopularToursCount = 9
            },
            new()
            {
                AirportId = airportMap["CDG"].Id,
                Code = "CDG",
                Name = "Paris Kinh Đô Ánh Sáng",
                City = "Paris",
                Country = "Pháp",
                ImageUrl = "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
                Description = "Kinh đô ánh sáng lãng mạn châu Âu, Tháp Eiffel sừng sững, Bảo tàng Louvre tráng lệ và du thuyền sông Seine thơ mộng.",
                Climate = "Ôn đới hải dương (12°C - 25°C)",
                BestTimeToVisit = "Tháng 5 - Tháng 10",
                PopularToursCount = 9
            },
            new()
            {
                AirportId = airportMap["JFK"].Id,
                Code = "JFK",
                Name = "New York Manhattan & Times Square",
                City = "New York",
                Country = "Hoa Kỳ",
                ImageUrl = "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80",
                Description = "Thành phố không ngủ hoa lệ nhất nước Mỹ, Tượng Nữ Thần Tự Do, Quảng trường Thời Đại Times Square và Công viên Trung tâm.",
                Climate = "Ôn đới lục địa (5°C - 28°C)",
                BestTimeToVisit = "Tháng 4 - Tháng 6, Tháng 9 - Tháng 11",
                PopularToursCount = 10
            }
        };

        foreach (var seed in destinationSeeds)
        {
            if (!destMap.TryGetValue(seed.Code, out var existing))
            {
                await context.Destinations.AddAsync(seed);
                destMap[seed.Code] = seed;
            }
        }
        await context.SaveChangesAsync();

        existingDestinations = await context.Destinations.ToListAsync();
        destMap = existingDestinations.ToDictionary(d => d.Code, d => d);

        // =====================================================================
        // 5. SEED USER ACCOUNTS (3 ROLES: ADMIN, TOUR OPERATOR, TRAVELER)
        // =====================================================================
        var existingUsers = await context.Users.ToListAsync();
        var userMap = existingUsers.ToDictionary(u => u.Email.ToLowerInvariant(), u => u);

        var userSeeds = new List<UserAccount>
        {
            new()
            {
                Username = "dispatcher_admin",
                Email = "admin@airport.gov",
                PasswordHash = "Admin@123456",
                FullName = "Chief Flight Administrator",
                Phone = "+84 909 123 456",
                Role = "ADMIN",
                CreatedAt = now
            },
            new()
            {
                Username = "superadmin",
                Email = "superadmin@aeroops.global",
                PasswordHash = "Admin@123456",
                FullName = "Aviation Security Director",
                Phone = "+84 909 888 777",
                Role = "ADMIN",
                CreatedAt = now
            },
            new()
            {
                Username = "tour_operator",
                Email = "operator@aeroops.global",
                PasswordHash = "Operator@123456",
                FullName = "AeroFlight Tour Operator",
                Phone = "+84 908 777 666",
                Role = "TOUR_OPERATOR",
                CreatedAt = now
            },
            new()
            {
                Username = "heritage_operator",
                Email = "expedition@aeroops.global",
                PasswordHash = "Operator@123456",
                FullName = "Heritage Aviation Tours Operator",
                Phone = "+84 908 555 444",
                Role = "TOUR_OPERATOR",
                CreatedAt = now
            },
            new()
            {
                Username = "alex_traveler",
                Email = "alex@gmail.com",
                PasswordHash = "Traveler@123456",
                FullName = "Alex Nguyen",
                Phone = "+84 918 888 999",
                Role = "TRAVELER",
                CreatedAt = now
            },
            new()
            {
                Username = "sophia_tran",
                Email = "sophia.tran@gmail.com",
                PasswordHash = "Traveler@123456",
                FullName = "Sophia Tran",
                Phone = "+84 903 555 123",
                Role = "TRAVELER",
                CreatedAt = now
            },
            new()
            {
                Username = "david_lee",
                Email = "david.lee@outlook.com",
                PasswordHash = "Traveler@123456",
                FullName = "David Lee",
                Phone = "+84 934 667 890",
                Role = "TRAVELER",
                CreatedAt = now
            }
        };

        foreach (var seed in userSeeds)
        {
            var key = seed.Email.ToLowerInvariant();
            if (!userMap.TryGetValue(key, out var existing))
            {
                await context.Users.AddAsync(seed);
                userMap[key] = seed;
            }
            else
            {
                // Enforce proper role alignment
                if (seed.Role == "TOUR_OPERATOR" && existing.Role != "TOUR_OPERATOR")
                {
                    existing.Role = "TOUR_OPERATOR";
                    existing.FullName = seed.FullName;
                    context.Users.Update(existing);
                }
                else if (seed.Role == "ADMIN" && existing.Role != "ADMIN")
                {
                    existing.Role = "ADMIN";
                    context.Users.Update(existing);
                }
            }
        }
        await context.SaveChangesAsync();

        existingUsers = await context.Users.ToListAsync();
        userMap = existingUsers.ToDictionary(u => u.Email.ToLowerInvariant(), u => u);
        var operatorUser = userMap["operator@aeroops.global"];
        var adminUser = userMap["admin@airport.gov"];

        // =====================================================================
        // 6. SEED TOURS (Aviation Exclusive Corridors)
        // =====================================================================
        var existingTours = await context.Tours.ToListAsync();
        var tourMap = existingTours.ToDictionary(t => t.Code, t => t);

        var tourSeeds = new List<Tour>
        {
            new()
            {
                DestinationId = destMap["DAD"].Id,
                AirlineId = airlineMap["VN"].Id,
                OperatorId = operatorUser.Id,
                Code = "VN-DAD-01",
                Title = "Đà Nẵng & Cầu Vàng Bà Nà Hills - Nghỉ Dưỡng Biển Mỹ Khê 5 Sao",
                Subtitle = "Bay thẳng Vietnam Airlines A350 + Resort 5 Sao Mặt Biển + Vé cáp treo Bà Nà Hills",
                Price = 320.00m,
                OriginalPrice = 399.00m,
                DurationDays = 3,
                DurationNights = 2,
                DepartureCity = "Ho Chi Minh City (SGN)",
                TransportType = "FLIGHT_EXCLUSIVE",
                FeaturedImage = "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b",
                GalleryImagesJson = "[\"https://images.unsplash.com/photo-1559592413-7cec4d0cae2b\",\"https://images.unsplash.com/photo-1540959733332-eab4deabeeaf\"]",
                HighlightsJson = "[\"Priority Check-in tại sân bay Tân Sơn Nhất (SGN) ga T2\",\"Bay thẳng máy bay thân rộng Airbus A350-900\",\"2 đêm nghỉ tại Resort 5 sao mặt biển Mỹ Khê\",\"Vé cáp treo trọn gói lên đỉnh Bà Nà & check-in Cầu Vàng\"]",
                InclusionsJson = "[\"Vé máy bay khứ hồi Vietnam Airlines bao gồm thuế phí\",\"2 đêm phòng Ocean View tại Pullman Danang Beach Resort 5 sao\",\"Buffet sáng chuẩn quốc tế hàng ngày\",\"Vé cáp treo & vé tham quan trọn gói Bà Nà Hills\",\"Xe Limousine đón tiễn riêng suốt hành trình\",\"Bảo hiểm du lịch hàng không trị giá $50,000\"]",
                ExclusionsJson = "[\"Chi phí ăn uống phát sinh ngoài chương trình\",\"Dịch vụ giặt ủi và đồ uống mini-bar\",\"Phụ thu kiện hành lý quá cước phát sinh\"]",
                BaggagePolicy = "Đã bao gồm 7kg hành lý xách tay + 20kg ký gửi tiêu chuẩn miễn cước. Hành khách có thể mua thêm gói phụ thu hành lý: Gói +10kg ($15), Gói +20kg ($28), Gói +30kg ($40), hoặc Gói dụng cụ thể thao Golf/Lướt sóng ($35).",
                CancellationPolicy = "Hủy trước 15 ngày khởi hành: Hoàn tiền 100%. Hủy trước 7-14 ngày: Hoàn tiền 70% (phạt 30%). Hủy trước 3-6 ngày: Hoàn tiền 40% (phạt 60%). Hủy trong vòng 48 giờ trước giờ bay: Không hoàn tiền (phạt 100%).",
                Rating = 4.9,
                ReviewsCount = 142,
                Status = "ACTIVE"
            },
            new()
            {
                DestinationId = destMap["PQC"].Id,
                AirlineId = airlineMap["VJ"].Id,
                OperatorId = operatorUser.Id,
                Code = "VJ-PQC-02",
                Title = "Phú Quốc Đảo Ngọc - Sunset Sanato & Cáp Treo Vượt Biển Hòn Thơm",
                Subtitle = "Bay Vietjet Air A321neo + Vinpearl Resort 5 Sao + Vé Safari & Grand World",
                Price = 265.00m,
                OriginalPrice = 330.00m,
                DurationDays = 4,
                DurationNights = 3,
                DepartureCity = "Ho Chi Minh City (SGN)",
                TransportType = "FLIGHT_EXCLUSIVE",
                FeaturedImage = "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf",
                GalleryImagesJson = "[\"https://images.unsplash.com/photo-1540959733332-eab4deabeeaf\",\"https://images.unsplash.com/photo-1559592413-7cec4d0cae2b\"]",
                HighlightsJson = "[\"Chuyến bay thẳng chớp nhoáng 55 phút SGN - PQC\",\"Ngắm hoàng hôn biểu tượng tại Sunset Sanato Beach Club\",\"Trải nghiệm cáp treo vượt biển 3 dây dài nhất thế giới Hòn Thơm\",\"Khám phá thành phố không ngủ Grand World & Vinpearl Safari\"]",
                InclusionsJson = "[\"Vé máy bay khứ hồi Vietjet Air\",\"3 đêm nghỉ dưỡng tại Vinpearl Resort & Spa Phú Quốc 5 sao\",\"Buffet sáng hàng ngày & 1 bữa tiệc hải sản Hàm Ninh\",\"Vé trải nghiệm cáp treo Hòn Thơm & công viên nước Aquatopia\",\"Xe đưa đón sân bay quốc tế Phú Quốc riêng\"]",
                ExclusionsJson = "[\"Phụ thu hành lý ký gửi quá cước\",\"Vé trò chơi tính phí ngoài danh mục tại Grand World\",\"Tiền tip cho hướng dẫn viên địa phương\"]",
                BaggagePolicy = "Đã bao gồm 7kg hành lý xách tay tiêu chuẩn. Hỗ trợ mua ưu đãi gói phụ thu ký gửi: Gói +10kg ($12), Gói +20kg ($22), Gói +30kg ($32), Dụng cụ lặn biển ($25).",
                CancellationPolicy = "Hủy trước 15 ngày: Hoàn tiền 100%. Hủy trước 7-14 ngày: Hoàn tiền 70% (phạt 30%). Hủy trước 3-6 ngày: Hoàn tiền 40% (phạt 60%). Hủy trong vòng 48h: Không hoàn tiền (phạt 100%).",
                Rating = 4.8,
                ReviewsCount = 98,
                Status = "ACTIVE"
            },
            new()
            {
                DestinationId = destMap["CXR"].Id,
                AirlineId = airlineMap["QH"].Id,
                OperatorId = operatorUser.Id,
                Code = "QH-CXR-03",
                Title = "Nha Trang Vịnh Biển Xanh - VinWonders & Du Thuyền Ngắm Hoàng Hôn",
                Subtitle = "Bay Bamboo Airways + Khách sạn 5 Sao Trần Phú + Tiệc BBQ Hải Sản Du Thuyền",
                Price = 295.00m,
                OriginalPrice = 360.00m,
                DurationDays = 3,
                DurationNights = 2,
                DepartureCity = "Ho Chi Minh City (SGN)",
                TransportType = "FLIGHT_EXCLUSIVE",
                FeaturedImage = "https://images.unsplash.com/photo-1542296332-2e4473faf563",
                GalleryImagesJson = "[\"https://images.unsplash.com/photo-1542296332-2e4473faf563\"]",
                HighlightsJson = "[\"Bay Bamboo Airways êm ái cùng tiếp viên hàng không chu đáo\",\"2 đêm nghỉ tại InterContinental Nha Trang view trọn vẹn vịnh biển\",\"Du ngoạn du thuyền Emperor Cruises ngắm hoàng hôn vịnh Nha Trang\",\"Trải nghiệm lặn biển ngắm san hô quý hiếm tại Hòn Mun\"]",
                InclusionsJson = "[\"Vé máy bay khứ hồi Bamboo Airways SGN-CXR-SGN\",\"2 đêm phòng cao cấp hướng biển\",\"Buffet sáng & tiệc tối BBQ hải sản trên du thuyền 5 sao\",\"Toàn bộ vé tham quan theo lịch trình\",\"Xe du lịch đời mới đưa đón sân bay\"]",
                ExclusionsJson = "[\"Chi phí bia rượu ngoài thực đơn set ăn\",\"Gói hành lý ký gửi bổ sung\",\"Các dịch vụ thể thao nước tự do\"]",
                BaggagePolicy = "Bao gồm 7kg xách tay + 20kg hành lý ký gửi. Phụ thu gói hành lý thêm: +10kg ($15), +20kg ($25), Dụng cụ lướt ván / Golf ($30).",
                CancellationPolicy = "Hủy trước 15 ngày: Hoàn 100%. Hủy trước 7-14 ngày: Hoàn 70%. Hủy trước 3-6 ngày: Hoàn 40%. Hủy dưới 48 giờ: Không hoàn tiền.",
                Rating = 4.9,
                ReviewsCount = 76,
                Status = "ACTIVE"
            },
            new()
            {
                DestinationId = destMap["HAN"].Id,
                AirlineId = airlineMap["VN"].Id,
                OperatorId = operatorUser.Id,
                Code = "VN-HAN-04",
                Title = "Hà Nội Ngàn Năm Văn Hiến & Du Thuyền Đẳng Cấp Vịnh Hạ Long",
                Subtitle = "Bay Vietnam Airlines + 1 Đêm Du Thuyền Ambassador 6 Sao Vịnh Hạ Long",
                Price = 385.00m,
                OriginalPrice = 480.00m,
                DurationDays = 4,
                DurationNights = 3,
                DepartureCity = "Ho Chi Minh City (SGN)",
                TransportType = "FLIGHT_EXCLUSIVE",
                FeaturedImage = "https://images.unsplash.com/photo-1528127269322-539801943592",
                GalleryImagesJson = "[\"https://images.unsplash.com/photo-1528127269322-539801943592\"]",
                HighlightsJson = "[\"Chuyến bay Vietnam Airlines đúng giờ khởi hành từ Tân Sơn Nhất\",\"Khám phá 36 phố phường Hà Nội cổ kính và thưởng thức phở truyền thống\",\"24 giờ nghỉ đêm thượng lưu trên du thuyền Ambassador 6 sao Hạ Long\",\"Chèo thuyền kayak qua hang Luồn và ngắm toàn cảnh vịnh từ đỉnh Titop\"]",
                InclusionsJson = "[\"Vé máy bay khứ hồi Vietnam Airlines\",\"2 đêm khách sạn 4 sao phố cổ Hà Nội\",\"1 đêm hải trình trên du thuyền Ambassador Hạ Long\",\"Các bữa ăn chất lượng cao theo chương trình\",\"Vé thắng cảnh vịnh Hạ Long và xe limousine di chuyển cao tốc\"]",
                ExclusionsJson = "[\"Đồ uống trên quầy bar du thuyền\",\"Gói chụp ảnh flycam riêng\",\"Hành lý quá cước\"]",
                BaggagePolicy = "Bao gồm 7kg xách tay + 23kg ký gửi tiêu chuẩn SkyTeam. Phụ thu thêm: +10kg ($18), +20kg ($32).",
                CancellationPolicy = "Hủy trước 15 ngày: Hoàn 100%. Hủy trước 7-14 ngày: Hoàn 70%. Hủy trước 3-6 ngày: Hoàn 40%. Hủy dưới 48 giờ: Không hoàn tiền.",
                Rating = 5.0,
                ReviewsCount = 110,
                Status = "ACTIVE"
            },
            new()
            {
                DestinationId = destMap["NRT"].Id,
                AirlineId = airlineMap["VN"].Id,
                OperatorId = operatorUser.Id,
                Code = "VN-NRT-05",
                Title = "Tokyo Hiện Đại & Núi Phú Sĩ Thần Bí - Mùa Hoa Rực Rỡ",
                Subtitle = "Chuyến bay thân rộng Boeing 787-9 Dreamliner + Khách sạn Shinjuku 4 Sao + Tàu Shinkansen",
                Price = 890.00m,
                OriginalPrice = 1050.00m,
                DurationDays = 5,
                DurationNights = 4,
                DepartureCity = "Ho Chi Minh City (SGN)",
                TransportType = "FLIGHT_EXCLUSIVE",
                FeaturedImage = "https://images.unsplash.com/photo-1503899036084-c55cdd92da26",
                GalleryImagesJson = "[\"https://images.unsplash.com/photo-1503899036084-c55cdd92da26\"]",
                HighlightsJson = "[\"Bay quốc tế trên tàu bay thế hệ mới Boeing 787-9 Dreamliner\",\"Khám phá ngã tư Shibuya náo nhiệt & phố điện tử Akihabara\",\"Chiêm ngưỡng núi Phú Sĩ tráng lệ từ hồ Kawaguchiko\",\"Trải nghiệm tàu siêu tốc Shinkansen vận tốc 320km/h\"]",
                InclusionsJson = "[\"Vé máy bay khứ hồi quốc tế Vietnam Airlines chặng SGN-NRT-SGN\",\"4 đêm lưu trú tại khách sạn 4 sao trung tâm Shinjuku\",\"Toàn bộ các bữa ăn ẩm thực Nhật Bản cao cấp (Wagyu, Sashimi)\",\"Vé tàu siêu tốc Shinkansen & Narita Skyliner Express\",\"Thủ tục xin visa du lịch Nhật Bản trọn gói\"]",
                ExclusionsJson = "[\"Chi phí mua sắm cá nhân tại các trung tâm thương mại Ginza\",\"Tiền bồi dưỡng hướng dẫn viên $7/ngày\",\"Phụ thu kiện hành lý thứ 3\"]",
                BaggagePolicy = "Đã bao gồm 2 kiện hành lý ký gửi (2 x 23kg = 46kg) + 12kg xách tay quốc tế. Phụ thu kiện thứ 3: $80/kiện. Dụng cụ trượt tuyết / Golf: $60.",
                CancellationPolicy = "Hủy trước 20 ngày khởi hành: Hoàn 100%. Hủy trước 10-19 ngày: Hoàn 70%. Hủy trước 4-9 ngày: Hoàn 40%. Hủy dưới 72 giờ: Không hoàn tiền.",
                Rating = 4.9,
                ReviewsCount = 156,
                Status = "ACTIVE"
            },
            new()
            {
                DestinationId = destMap["ICN"].Id,
                AirlineId = airlineMap["VJ"].Id,
                OperatorId = operatorUser.Id,
                Code = "VJ-ICN-06",
                Title = "Seoul Mùa Thu Lãng Mạn - Cung Điện Hoàng Gia & Đảo Nami Xinh Đẹp",
                Subtitle = "Bay Vietjet Air A321neo + Lotte World Theme Park + Trải nghiệm Hanbok Cung Điện",
                Price = 580.00m,
                OriginalPrice = 720.00m,
                DurationDays = 5,
                DurationNights = 4,
                DepartureCity = "Ho Chi Minh City (SGN)",
                TransportType = "FLIGHT_EXCLUSIVE",
                FeaturedImage = "https://images.unsplash.com/photo-1538485399081-7191377e8241",
                GalleryImagesJson = "[\"https://images.unsplash.com/photo-1538485399081-7191377e8241\"]",
                HighlightsJson = "[\"Bay thẳng SGN - ICN hạ cánh tại sân bay quốc tế Incheon hiện đại\",\"Chụp ảnh trang phục Hanbok truyền thống tại cung điện Gyeongbokgung\",\"Dạo bước dưới hàng cây ngân hạnh tuyệt đẹp tại đảo Nami\",\"Thỏa sức vui chơi tại công viên giải trí trong nhà lớn nhất thế giới Lotte World\"]",
                InclusionsJson = "[\"Vé máy bay khứ hồi Vietjet Air bao gồm thuế phí\",\"Khách sạn 4 sao quận Myeongdong thuận tiện mua sắm\",\"Các bữa ăn mang đậm phong vị xứ kim chi (BBQ Hàn Quốc, gà tần sâm)\",\"Vé tham quan công viên Lotte World & đảo Nami\",\"Hỗ trợ nộp hồ sơ visa Hàn Quốc\"]",
                ExclusionsJson = "[\"Phụ thu hành lý ký gửi quá 20kg\",\"Chi phí ăn vặt tại chợ đêm Myeongdong\",\"Tiền tip cho tài xế và HDV địa phương\"]",
                BaggagePolicy = "Đã bao gồm 7kg xách tay + 20kg ký gửi. Mua thêm phụ thu: +10kg ($25), +20kg ($45).",
                CancellationPolicy = "Hủy trước 15 ngày: Hoàn 100%. Hủy 7-14 ngày: Hoàn 70%. Hủy 3-6 ngày: Hoàn 40%. Hủy dưới 48h: Phạt 100%.",
                Rating = 4.8,
                ReviewsCount = 88,
                Status = "ACTIVE"
            },
            new()
            {
                DestinationId = destMap["SIN"].Id,
                AirlineId = airlineMap["SQ"].Id,
                OperatorId = operatorUser.Id,
                Code = "SQ-SIN-07",
                Title = "Singapore Đảo Quốc Sư Tử - Marina Bay Sands & Thác Nước Jewel Changi",
                Subtitle = "Hãng bay 5 Sao Singapore Airlines + Khách sạn 4 Sao Orchard + Gardens by the Bay",
                Price = 520.00m,
                OriginalPrice = 640.00m,
                DurationDays = 4,
                DurationNights = 3,
                DepartureCity = "Ho Chi Minh City (SGN)",
                TransportType = "FLIGHT_EXCLUSIVE",
                FeaturedImage = "https://images.unsplash.com/photo-1525625293386-3f8f99389edd",
                GalleryImagesJson = "[\"https://images.unsplash.com/photo-1525625293386-3f8f99389edd\"]",
                HighlightsJson = "[\"Trải nghiệm dịch vụ hàng không 5 sao đẳng cấp thế giới Singapore Airlines\",\"Chiêm ngưỡng rừng mây Cloud Forest & Flower Dome tại Gardens by the Bay\",\"Check-in thác nước mưa khổng lồ Rain Vortex tại Jewel Changi Airport\",\"Thưởng thức ẩm thực đa văn hóa Chili Crab nức tiếng\"]",
                InclusionsJson = "[\"Vé máy bay khứ hồi Singapore Airlines 5 sao\",\"3 đêm khách sạn 4 sao nằm ngay trục phố mua sắm Orchard Road\",\"Các bữa ăn chất lượng theo thực đơn bản địa cao cấp\",\"Vé vào cổng Gardens by the Bay & đài quan sát Marina Bay Sands SkyPark\",\"Xe đưa đón máy lạnh riêng suốt hành trình\"]",
                ExclusionsJson = "[\"Chi phí shopping tại các trung tâm thương mại Orchard\",\"Đồ uống gọi thêm ngoài thực đơn\",\"Hành lý vượt mức 25kg miễn cước\"]",
                BaggagePolicy = "Bao gồm 7kg xách tay + 25kg ký gửi 5 sao Star Alliance. Phụ thu thêm +10kg ($28), +20kg ($50).",
                CancellationPolicy = "Hủy trước 15 ngày: Hoàn 100%. Hủy 7-14 ngày: Hoàn 70%. Hủy 3-6 ngày: Hoàn 40%. Hủy dưới 48h: Không hoàn tiền.",
                Rating = 4.9,
                ReviewsCount = 134,
                Status = "ACTIVE"
            },
            new()
            {
                DestinationId = destMap["CDG"].Id,
                AirlineId = airlineMap["AF"].Id,
                OperatorId = operatorUser.Id,
                Code = "AF-CDG-08",
                Title = "Paris Kinh Đô Ánh Sáng & Khải Hoàn Môn - Du Thuyền Sông Seine Thơ Mộng",
                Subtitle = "Chuyến bay liên lục địa Air France Boeing 777 + Khách sạn 4 Sao Trung tâm Paris + Louvre Pass",
                Price = 1680.00m,
                OriginalPrice = 1990.00m,
                DurationDays = 7,
                DurationNights = 6,
                DepartureCity = "Ho Chi Minh City (SGN)",
                TransportType = "FLIGHT_EXCLUSIVE",
                FeaturedImage = "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
                GalleryImagesJson = "[\"https://images.unsplash.com/photo-1502602898657-3e91760cbb34\"]",
                HighlightsJson = "[\"Hải trình bay liên lục địa tiện nghi với Air France SkyTeam\",\"Lên tầng 2 Tháp Eiffel ngắm toàn cảnh kinh đô hoa lệ\",\"Tham quan bảo tàng Louvre chiêm ngưỡng nàng Mona Lisa nguyên bản\",\"Du thuyền ngắm hoàng hôn sông Seine lãng mạn kèm rượu vang Pháp\"]",
                InclusionsJson = "[\"Vé máy bay khứ hồi quốc tế Air France chặng SGN - CDG - SGN\",\"6 đêm khách sạn 4 sao phong cách cổ điển Pháp ngay trung tâm\",\"Ẩm thực tinh hoa chuẩn Michelin và các bữa ăn truyền thống Âu\",\"Toàn bộ vé tham quan danh lam thắng cảnh và du thuyền sông Seine\",\"Phí dịch thuật công chứng và dịch vụ visa Schengen trọn gói\"]",
                ExclusionsJson = "[\"Tiền tip theo quy chuẩn châu Âu ($10/ngày)\",\"Thuế lưu trú thành phố Paris trả trực tiếp tại khách sạn\",\"Chi phí mua hàng xa xỉ phẩm\"]",
                BaggagePolicy = "Bao gồm 2 x 23kg ký gửi + 12kg xách tay liên lục địa. Phụ thu kiện thứ 3: $120. Phụ thu hành lý đặc biệt: $90.",
                CancellationPolicy = "Hủy trước 30 ngày: Hoàn 100%. Hủy trước 15-29 ngày: Hoàn 75%. Hủy trước 7-14 ngày: Hoàn 50%. Hủy dưới 7 ngày: Không hoàn tiền.",
                Rating = 5.0,
                ReviewsCount = 62,
                Status = "ACTIVE"
            }
        };

        foreach (var seed in tourSeeds)
        {
            if (!tourMap.TryGetValue(seed.Code, out var existing))
            {
                await context.Tours.AddAsync(seed);
                tourMap[seed.Code] = seed;
            }
            else
            {
                // Update policy fields if they were missing or empty
                existing.Title = seed.Title;
                existing.Subtitle = seed.Subtitle;
                existing.BaggagePolicy = seed.BaggagePolicy;
                existing.CancellationPolicy = seed.CancellationPolicy;
                existing.InclusionsJson = seed.InclusionsJson;
                existing.ExclusionsJson = seed.ExclusionsJson;
                existing.HighlightsJson = seed.HighlightsJson;
                existing.TransportType = "FLIGHT_EXCLUSIVE";
                existing.OperatorId = operatorUser.Id;
                context.Tours.Update(existing);
            }
        }

        // Load and seed ~100 diverse tours from tours100.json
        var tours100 = LoadTours100();
        foreach (var tSeed in tours100)
        {
            if (!tourMap.TryGetValue(tSeed.Code, out var existing))
            {
                if (!destMap.TryGetValue(tSeed.DestinationCode, out var dest))
                {
                    continue;
                }
                var airline = airlineMap.TryGetValue(tSeed.AirlineCode, out var air) ? air : airlineMap["VN"];

                var newTour = new Tour
                {
                    DestinationId = dest.Id,
                    AirlineId = airline.Id,
                    OperatorId = operatorUser.Id,
                    Code = tSeed.Code,
                    Title = tSeed.Title,
                    Subtitle = tSeed.Subtitle,
                    Price = tSeed.Price,
                    OriginalPrice = tSeed.OriginalPrice,
                    DurationDays = tSeed.DurationDays,
                    DurationNights = tSeed.DurationNights,
                    DepartureCity = tSeed.DepartureCity,
                    TransportType = "FLIGHT_EXCLUSIVE",
                    FeaturedImage = tSeed.FeaturedImage,
                    GalleryImagesJson = System.Text.Json.JsonSerializer.Serialize(tSeed.GalleryImages ?? new List<string> { tSeed.FeaturedImage }),
                    HighlightsJson = System.Text.Json.JsonSerializer.Serialize(tSeed.Highlights ?? new List<string>()),
                    InclusionsJson = "[\"Vé máy bay khứ hồi theo chuyến bay độc quyền\",\"Khách sạn / Resort tiêu chuẩn 4-5 sao\",\"Các bữa ăn theo chương trình\",\"Vé tham quan các điểm du lịch\",\"Bảo hiểm du lịch hàng không tối đa $50,000\"]",
                    ExclusionsJson = "[\"Chi phí cá nhân ngoài hành trình\",\"Hành lý quá cước phát sinh\",\"Đồ uống gọi thêm ngoài thực đơn\"]",
                    BaggagePolicy = tSeed.BaggagePolicy ?? "Đã bao gồm 7kg xách tay + 20kg ký gửi miễn cước. Hỗ trợ mua phụ thu: +10kg ($15), +20kg ($28), Gói Golf/Thể thao ($35).",
                    CancellationPolicy = tSeed.CancellationPolicy ?? "Hủy trước 15 ngày: Hoàn 100%. Hủy trước 7-14 ngày: Hoàn 70%. Hủy trước 3-6 ngày: Hoàn 40%. Hủy dưới 48 giờ: Không hoàn tiền.",
                    Rating = tSeed.Rating,
                    ReviewsCount = tSeed.ReviewsCount,
                    Status = tSeed.Status
                };

                await context.Tours.AddAsync(newTour);
                tourMap[tSeed.Code] = newTour;
            }
        }

        // Also ensure any legacy tour has baggage and cancellation policy
        var legacyTours = await context.Tours.Where(t => string.IsNullOrEmpty(t.BaggagePolicy) || string.IsNullOrEmpty(t.CancellationPolicy)).ToListAsync();
        foreach (var lt in legacyTours)
        {
            lt.BaggagePolicy = "Đã bao gồm 7kg hành lý xách tay + 20kg ký gửi tiêu chuẩn. Hỗ trợ mua thêm phụ thu: +10kg ($15), +20kg ($28), Gói dụng cụ thể thao ($35).";
            lt.CancellationPolicy = "Hủy trước 15 ngày: Hoàn 100%. Hủy trước 7-14 ngày: Hoàn 70%. Hủy trước 3-6 ngày: Hoàn 40%. Hủy trong vòng 48h: Phạt 100%.";
            lt.TransportType = "FLIGHT_EXCLUSIVE";
            lt.OperatorId = operatorUser.Id;
            context.Tours.Update(lt);
        }
        await context.SaveChangesAsync();

        existingTours = await context.Tours.ToListAsync();
        tourMap = existingTours.ToDictionary(t => t.Code, t => t);

        // =====================================================================
        // 7. SEED ITINERARY DAYS FOR ALL TOURS
        // =====================================================================
        var existingDays = await context.ItineraryDays.ToListAsync();
        var tourDayCount = existingDays.GroupBy(d => d.TourId).ToDictionary(g => g.Key, g => g.Count());

        var daysToInsert = new List<ItineraryDay>();

        // Ensure Tour 1 has full itinerary
        if (!tourDayCount.ContainsKey(tourMap["VN-DAD-01"].Id))
        {
            var t1 = tourMap["VN-DAD-01"].Id;
            daysToInsert.AddRange(new[]
            {
                new ItineraryDay { TourId = t1, DayNumber = 1, Title = "Khởi hành SGN - Đáp chuyến bay đến Đà Nẵng", Description = "Làm thủ tục ưu tiên tại SGN T2, khởi hành chuyến bay VN-124. Hạ cánh sân bay Đà Nẵng, xe Limousine đón về nhận phòng Pullman Resort.", ActivitiesJson = "[\"Làm thủ tục VIP check-in ga SGN T2\",\"Bay thẳng Airbus A350\",\"Check-in Pullman Danang Beach Resort\",\"Thưởng thức hải sản biển Mỹ Khê\"]", Meals = "Ăn tối chào mừng", Stay = "Pullman Danang Beach Resort 5 Sao" },
                new ItineraryDay { TourId = t1, DayNumber = 2, Title = "Chinh phục đỉnh Bà Nà Hills & Check-in Cầu Vàng", Description = "Đi cáp treo đạt kỷ lục thế giới lên Bà Nà Hills, check-in cây Cầu Vàng kỳ vĩ, khám phá làng Pháp và khu vui chơi Fantasy Park.", ActivitiesJson = "[\"Cáp treo Bà Nà Hills\",\"Chụp ảnh Cầu Vàng sáng sớm\",\"Khám phá Làng Pháp & Hầm rượu Debay\",\"Buffet quốc tế đỉnh núi Bà Nà\"]", Meals = "Ăn sáng, Buffet trưa Bà Nà", Stay = "Pullman Danang Beach Resort 5 Sao" },
                new ItineraryDay { TourId = t1, DayNumber = 3, Title = "Bán đảo Sơn Trà - Bay trở về TP. Hồ Chí Minh", Description = "Viếng Chùa Linh Ứng ngắm trọn vịnh Đà Nẵng, mua sắm đặc sản Chợ Hàn, xe đưa ra sân bay DAD đáp chuyến bay VN-129 về lại SGN.", ActivitiesJson = "[\"Viếng Chùa Linh Ứng Bán đảo Sơn Trà\",\"Mua sắm đặc sản Chợ Hàn\",\"Xe tiễn sân bay DAD\",\"Chuyến bay VN-129 về SGN\"]", Meals = "Ăn sáng resort", Stay = "Kết thúc hải trình" }
            });
        }

        // Tour 2: Phu Quoc
        if (!tourDayCount.ContainsKey(tourMap["VJ-PQC-02"].Id))
        {
            var t2 = tourMap["VJ-PQC-02"].Id;
            daysToInsert.AddRange(new[]
            {
                new ItineraryDay { TourId = t2, DayNumber = 1, Title = "Bay đến Phú Quốc - Sunset Sanato hoàng hôn", Description = "Khởi hành từ SGN với chuyến bay VJ-362 đến sân bay quốc tế Phú Quốc. Check-in Vinpearl Resort & thưởng ngoạn hoàng hôn Sunset Sanato.", ActivitiesJson = "[\"Bay Vietjet VJ-362 SGN - PQC\",\"Nhận phòng Vinpearl Resort 5 sao\",\"Ngắm hoàng hôn nghệ thuật Sunset Sanato\"]", Meals = "Ăn tối hải sản", Stay = "Vinpearl Resort & Spa Phú Quốc" },
                new ItineraryDay { TourId = t2, DayNumber = 2, Title = "Cáp treo vượt biển Hòn Thơm & Công viên nước", Description = "Trải nghiệm tuyến cáp treo vượt biển dài nhất thế giới ngắm biển Nam Đảo ngoạn mục, vui chơi thỏa thích tại công viên nước Aquatopia.", ActivitiesJson = "[\"Cáp treo 3 dây vượt biển Hòn Thơm\",\"Công viên nước Aquatopia\",\"Tắm biển Bãi Trào cát trắng\"]", Meals = "Ăn sáng, Ăn trưa buffet", Stay = "Vinpearl Resort & Spa Phú Quốc" },
                new ItineraryDay { TourId = t2, DayNumber = 3, Title = "Vinpearl Safari & Thành phố không ngủ Grand World", Description = "Khám phá vườn thú bán hoang dã Safari lớn nhất Việt Nam, du ngoạn thuyền Gondola phong cách Ý tại thành phố không ngủ Grand World.", ActivitiesJson = "[\"Xe chuyên dụng ngắm thú Vinpearl Safari\",\"Du ngoạn kênh đào Grand World Venice\",\"Xem show diễn thực cảnh Tinh Hoa Việt Nam\"]", Meals = "Ăn sáng, Ăn trưa", Stay = "Vinpearl Resort & Spa Phú Quốc" },
                new ItineraryDay { TourId = t2, DayNumber = 4, Title = "Tự do nghỉ dưỡng bãi biển - Bay về SGN", Description = "Tận hưởng hồ bơi vô cực và bãi biển riêng của resort, trả phòng và ra sân bay PQC đáp chuyến bay về lại Tân Sơn Nhất.", ActivitiesJson = "[\"Thư giãn tại bãi biển resort\",\"Mua quà đặc sản ngọc trai, tiêu Phú Quốc\",\"Bay trở về TP.HCM\"]", Meals = "Ăn sáng", Stay = "Kết thúc hải trình" }
            });
        }

        // Tour 5: Tokyo
        if (!tourDayCount.ContainsKey(tourMap["VN-NRT-05"].Id))
        {
            var t5 = tourMap["VN-NRT-05"].Id;
            daysToInsert.AddRange(new[]
            {
                new ItineraryDay { TourId = t5, DayNumber = 1, Title = "Hải trình bay Boeing 787 SGN - NRT Tokyo", Description = "Tập trung tại ga quốc tế Tân Sơn Nhất, đáp chuyến bay thẳng VN-300 sang Tokyo. Làm thủ tục nhập cảnh và đi tàu cao tốc Narita Skyliner về khách sạn.", ActivitiesJson = "[\"Chuyến bay thân rộng Boeing 787-9\",\"Tàu cao tốc Narita Skyliner\",\"Nhận phòng khách sạn 4 sao Shinjuku\"]", Meals = "Ăn nhẹ trên máy bay, Ăn tối mì Ramen truyền thống", Stay = "Shinjuku Prince Hotel Tokyo 4 Sao" },
                new ItineraryDay { TourId = t5, DayNumber = 2, Title = "Tokyo hiện đại: Shibuya - Harajuku - Tháp Tokyo", Description = "Trải nghiệm ngã tư Shibuya huyền thoại, check-in tượng chú chó Hachiko, mua sắm phố thời trang Harajuku và lên đài quan sát tháp Tokyo Skytree.", ActivitiesJson = "[\"Ngã tư Shibuya Crossing\",\"Đền Meiji Jingu & phố Harajuku\",\"Đài quan sát tháp Tokyo Skytree\"]", Meals = "Ăn sáng, Ăn trưa món nướng Yakiniku", Stay = "Shinjuku Prince Hotel Tokyo 4 Sao" },
                new ItineraryDay { TourId = t5, DayNumber = 3, Title = "Kỳ quan Núi Phú Sĩ & Trải nghiệm tắm khoáng Onsen", Description = "Khởi hành đi ngắm ngọn núi Phú Sĩ biểu tượng tại trạm số 5, dạo quanh hồ Kawaguchiko thơ mộng và trải nghiệm tắm suối nước nóng Onsen xua tan mệt mỏi.", ActivitiesJson = "[\"Lên trạm 5 núi Phú Sĩ\",\"Hồ Kawaguchiko ngắm núi phản chiếu\",\"Tắm khoáng nóng Onsen truyền thống Nhật\"]", Meals = "Ăn sáng, Lẩu hải sản Phú Sĩ", Stay = "Fuji Onsen Resort" },
                new ItineraryDay { TourId = t5, DayNumber = 4, Title = "Trải nghiệm Tàu Siêu Tốc Shinkansen - Mua sắm Ginza", Description = "Trải nghiệm tàu Shinkansen lao vút 320km/h về trung tâm Tokyo, thỏa sức mua sắm hàng hiệu và quà lưu niệm tại khu phố tài chính thượng lưu Ginza.", ActivitiesJson = "[\"Tàu cao tốc Shinkansen 320km/h\",\"Thiên đường mua sắm Ginza\",\"Thưởng thức bò Wagyu A5 thượng hạng\"]", Meals = "Ăn sáng, Bò Wagyu cao cấp", Stay = "Shinjuku Prince Hotel Tokyo 4 Sao" },
                new ItineraryDay { TourId = t5, DayNumber = 5, Title = "Chợ cá Tsukiji - Sân bay Narita - Bay về SGN", Description = "Thưởng thức sushi cá hồi và cá ngừ tươi ngon tại chợ cá Tsukiji, xe đưa đoàn ra sân bay Narita làm thủ tục hoàn thuế và đáp chuyến bay về Việt Nam.", ActivitiesJson = "[\"Khám phá chợ ẩm thực Tsukiji\",\"Mua sắm Duty Free sân bay Narita\",\"Bay về ga quốc tế SGN\"]", Meals = "Ăn sáng, Sushi tươi sống", Stay = "Kết thúc hải trình" }
            });
        }

        // Seed itineraries from tours100 for all seeded tours without days
        foreach (var tSeed in tours100)
        {
            if (tourMap.TryGetValue(tSeed.Code, out var tourEntity) && !tourDayCount.ContainsKey(tourEntity.Id) && tSeed.Itinerary != null)
            {
                foreach (var dayDto in tSeed.Itinerary)
                {
                    daysToInsert.Add(new ItineraryDay
                    {
                        TourId = tourEntity.Id,
                        DayNumber = dayDto.DayNumber,
                        Title = dayDto.Title,
                        Description = dayDto.Description,
                        ActivitiesJson = System.Text.Json.JsonSerializer.Serialize(dayDto.Activities ?? new List<string>()),
                        Meals = dayDto.Meals,
                        Stay = dayDto.Stay
                    });
                }
            }
        }

        if (daysToInsert.Count > 0)
        {
            await context.ItineraryDays.AddRangeAsync(daysToInsert);
            await context.SaveChangesAsync();
        }

        // =====================================================================
        // 8. SEED FLIGHTS (Corridor Flight Manifests)
        // =====================================================================
        var existingFlights = await context.Flights.ToListAsync();
        var flightMap = existingFlights.ToDictionary(f => f.FlightNumber, f => f);

        var flightSeeds = new List<Flight>
        {
            new()
            {
                TourId = tourMap["VN-DAD-01"].Id,
                OriginAirportId = airportMap["SGN"].Id,
                DestinationAirportId = airportMap["DAD"].Id,
                AirlineId = airlineMap["VN"].Id,
                AircraftId = aircraftMap["VN-A899"].Id,
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
                TourId = tourMap["VN-DAD-01"].Id,
                OriginAirportId = airportMap["SGN"].Id,
                DestinationAirportId = airportMap["DAD"].Id,
                AirlineId = airlineMap["VN"].Id,
                AircraftId = aircraftMap["VN-A899"].Id,
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
                TourId = tourMap["VJ-PQC-02"].Id,
                OriginAirportId = airportMap["SGN"].Id,
                DestinationAirportId = airportMap["PQC"].Id,
                AirlineId = airlineMap["VJ"].Id,
                AircraftId = aircraftMap["VN-A321"].Id,
                FlightNumber = "VJ-362",
                DepartureTime = now.AddHours(4),
                ArrivalTime = now.AddHours(5).AddMinutes(05),
                Terminal = "T1",
                Gate = "G04",
                TotalSeats = 230,
                SeatsAvailable = 195,
                Price = 85.00m,
                Status = "BOARDING"
            },
            new()
            {
                TourId = tourMap["QH-CXR-03"].Id,
                OriginAirportId = airportMap["SGN"].Id,
                DestinationAirportId = airportMap["CXR"].Id,
                AirlineId = airlineMap["QH"].Id,
                AircraftId = aircraftMap["VN-A888"].Id,
                FlightNumber = "QH-152",
                DepartureTime = now.AddHours(7),
                ArrivalTime = now.AddHours(8).AddMinutes(10),
                Terminal = "T1",
                Gate = "G09",
                TotalSeats = 294,
                SeatsAvailable = 260,
                Price = 95.00m,
                Status = "SCHEDULED"
            },
            new()
            {
                TourId = tourMap["VN-HAN-04"].Id,
                OriginAirportId = airportMap["SGN"].Id,
                DestinationAirportId = airportMap["HAN"].Id,
                AirlineId = airlineMap["VN"].Id,
                AircraftId = aircraftMap["VN-A688"].Id,
                FlightNumber = "VN-210",
                DepartureTime = now.AddHours(3).AddMinutes(30),
                ArrivalTime = now.AddHours(5).AddMinutes(40),
                Terminal = "T2",
                Gate = "G15",
                TotalSeats = 274,
                SeatsAvailable = 210,
                Price = 145.00m,
                Status = "ON_TIME"
            },
            new()
            {
                TourId = tourMap["VN-NRT-05"].Id,
                OriginAirportId = airportMap["SGN"].Id,
                DestinationAirportId = airportMap["NRT"].Id,
                AirlineId = airlineMap["VN"].Id,
                AircraftId = aircraftMap["VN-A688"].Id,
                FlightNumber = "VN-300",
                DepartureTime = now.AddHours(8),
                ArrivalTime = now.AddHours(13).AddMinutes(30),
                Terminal = "T2",
                Gate = "G24",
                TotalSeats = 274,
                SeatsAvailable = 198,
                Price = 450.00m,
                Status = "SCHEDULED"
            },
            new()
            {
                TourId = tourMap["SQ-SIN-07"].Id,
                OriginAirportId = airportMap["SGN"].Id,
                DestinationAirportId = airportMap["SIN"].Id,
                AirlineId = airlineMap["SQ"].Id,
                AircraftId = aircraftMap["9V-SWB"].Id,
                FlightNumber = "SQ-178",
                DepartureTime = now.AddHours(5).AddMinutes(15),
                ArrivalTime = now.AddHours(8).AddMinutes(25),
                Terminal = "T2",
                Gate = "G21",
                TotalSeats = 264,
                SeatsAvailable = 180,
                Price = 280.00m,
                Status = "ON_TIME"
            },
            new()
            {
                TourId = tourMap["AF-CDG-08"].Id,
                OriginAirportId = airportMap["SGN"].Id,
                DestinationAirportId = airportMap["CDG"].Id,
                AirlineId = airlineMap["AF"].Id,
                AircraftId = aircraftMap["F-GSQA"].Id,
                FlightNumber = "AF-258",
                DepartureTime = now.AddHours(11),
                ArrivalTime = now.AddHours(23).AddMinutes(40),
                Terminal = "T2",
                Gate = "G28",
                TotalSeats = 296,
                SeatsAvailable = 240,
                Price = 750.00m,
                Status = "SCHEDULED"
            }
        };

        foreach (var seed in flightSeeds)
        {
            if (!flightMap.TryGetValue(seed.FlightNumber, out var existing))
            {
                await context.Flights.AddAsync(seed);
                flightMap[seed.FlightNumber] = seed;
            }
        }
        await context.SaveChangesAsync();

        // Ensure every tour in the system has at least one scheduled flight
        existingFlights = await context.Flights.ToListAsync();
        var tourFlightCount = existingFlights.Where(f => f.TourId.HasValue).GroupBy(f => f.TourId!.Value).ToDictionary(g => g.Key, g => g.Count());

        var newFlightsToInsert = new List<Flight>();
        int flightCounter = 500;
        foreach (var tour in existingTours)
        {
            if (!tourFlightCount.ContainsKey(tour.Id))
            {
                flightCounter++;
                var airline = (tour.AirlineId.HasValue && airlineMap.Values.Any(a => a.Id == tour.AirlineId))
                    ? airlineMap.Values.First(a => a.Id == tour.AirlineId)
                    : airlineMap["VN"];
                var aircraft = aircraftMap.Values.FirstOrDefault(a => a.AirlineId == airline.Id) ?? aircraftMap.Values.First();
                var destCode = destMap.Values.FirstOrDefault(d => d.Id == tour.DestinationId)?.Code ?? "DAD";
                var destAirport = airportMap.TryGetValue(destCode, out var da) ? da : airportMap["DAD"];

                var fNumber = $"{airline.IataCode}-{flightCounter}";
                newFlightsToInsert.Add(new Flight
                {
                    TourId = tour.Id,
                    OriginAirportId = airportMap["SGN"].Id,
                    DestinationAirportId = destAirport.Id,
                    AirlineId = airline.Id,
                    AircraftId = aircraft.Id,
                    FlightNumber = fNumber,
                    DepartureTime = now.AddHours(2 + (flightCounter % 16)),
                    ArrivalTime = now.AddHours(4 + (flightCounter % 16)),
                    Terminal = "T2",
                    Gate = $"G{(flightCounter % 20 + 1):D2}",
                    TotalSeats = aircraft.Capacity > 0 ? aircraft.Capacity : 250,
                    SeatsAvailable = Math.Max(50, (aircraft.Capacity > 0 ? aircraft.Capacity : 250) - 20),
                    Price = Math.Round(tour.Price * 0.45m, 2),
                    Status = "SCHEDULED"
                });
            }
        }

        if (newFlightsToInsert.Count > 0)
        {
            await context.Flights.AddRangeAsync(newFlightsToInsert);
            await context.SaveChangesAsync();
        }

        // Update PopularToursCount for destinations
        var tourCountsByDest = await context.Tours.GroupBy(t => t.DestinationId).Select(g => new { DestId = g.Key, Count = g.Count() }).ToListAsync();
        foreach (var tc in tourCountsByDest)
        {
            var dest = destMap.Values.FirstOrDefault(d => d.Id == tc.DestId);
            if (dest != null && dest.PopularToursCount != tc.Count)
            {
                dest.PopularToursCount = tc.Count;
                context.Destinations.Update(dest);
            }
        }
        await context.SaveChangesAsync();

        existingFlights = await context.Flights.ToListAsync();
        flightMap = existingFlights.ToDictionary(f => f.FlightNumber, f => f);

        // =====================================================================
        // 9. SEED BOOKINGS (With Baggage Packages, Cancellation Policy Scenarios)
        // =====================================================================
        var existingBookings = await context.Bookings.ToListAsync();
        var bookingMap = existingBookings.ToDictionary(b => b.BookingReference, b => b);

        var bookingSeeds = new List<Booking>
        {
            // Scenario 1: Paid with Baggage Package +10kg
            new()
            {
                BookingReference = "BK-2026-8849",
                UserId = userMap["alex@gmail.com"].Id,
                FlightId = flightMap["VN-124"].Id,
                TourId = tourMap["VN-DAD-01"].Id,
                Route = "SGN -> DAD",
                CustomerName = "Alex Nguyen",
                CustomerEmail = "alex@gmail.com",
                CustomerPhone = "+84 918 888 999",
                AdultsCount = 1,
                ChildrenCount = 0,
                TotalPrice = 335.00m,
                DiscountAmount = 0.00m,
                BaggagePackage = "EXTRA_10KG",
                BaggageFee = 15.00m,
                PaymentMethod = "CREDIT_CARD",
                BookingStatus = "PAID",
                Notes = "Ghế thoát hiểm gần cửa sổ đã chọn",
                CreatedAt = now.AddHours(-12)
            },
            // Scenario 2: Confirmed with Baggage Package +20kg
            new()
            {
                BookingReference = "BK-2026-9214",
                UserId = userMap["sophia.tran@gmail.com"].Id,
                FlightId = flightMap["VN-300"].Id,
                TourId = tourMap["VN-NRT-05"].Id,
                Route = "SGN -> NRT",
                CustomerName = "Sophia Tran",
                CustomerEmail = "sophia.tran@gmail.com",
                CustomerPhone = "+84 903 555 123",
                AdultsCount = 1,
                ChildrenCount = 0,
                TotalPrice = 918.00m,
                DiscountAmount = 0.00m,
                BaggagePackage = "EXTRA_20KG",
                BaggageFee = 28.00m,
                PaymentMethod = "BANK_TRANSFER",
                BookingStatus = "CONFIRMED",
                Notes = "Yêu cầu thực đơn chay trên chuyến bay quốc tế",
                CreatedAt = now.AddHours(-8)
            },
            // Scenario 3: Cancelled with Refund policy execution
            new()
            {
                BookingReference = "BK-2026-7731",
                UserId = userMap["david.lee@outlook.com"].Id,
                FlightId = flightMap["QH-152"].Id,
                TourId = tourMap["QH-CXR-03"].Id,
                Route = "SGN -> CXR",
                CustomerName = "David Lee",
                CustomerEmail = "david.lee@outlook.com",
                CustomerPhone = "+84 934 667 890",
                AdultsCount = 1,
                ChildrenCount = 0,
                TotalPrice = 295.00m,
                DiscountAmount = 0.00m,
                BaggagePackage = "NONE",
                BaggageFee = 0.00m,
                RefundAmount = 206.50m, // 70% refund according to 7-14 days policy
                CancellationReason = "Hủy tour do bận lịch công tác đột xuất ở nước ngoài",
                CancellationDate = now.AddHours(-3),
                PaymentMethod = "CREDIT_CARD",
                BookingStatus = "CANCELLED",
                Notes = "Đã hoàn 70% tiền ($206.50) về thẻ tín dụng của hành khách",
                CreatedAt = now.AddDays(-3)
            },
            // Scenario 4: Paid with Sports Equipment Baggage
            new()
            {
                BookingReference = "BK-2026-6502",
                UserId = userMap["alex@gmail.com"].Id,
                FlightId = flightMap["VJ-362"].Id,
                TourId = tourMap["VJ-PQC-02"].Id,
                Route = "SGN -> PQC",
                CustomerName = "Alex Nguyen",
                CustomerEmail = "alex@gmail.com",
                CustomerPhone = "+84 918 888 999",
                AdultsCount = 1,
                ChildrenCount = 0,
                TotalPrice = 290.00m,
                DiscountAmount = 0.00m,
                BaggagePackage = "SPORTS_EQUIPMENT",
                BaggageFee = 25.00m,
                PaymentMethod = "ZALO_PAY",
                BookingStatus = "PAID",
                Notes = "Hành khách mang theo bộ dụng cụ lặn biển chuyên dụng",
                CreatedAt = now.AddHours(-5)
            },
            // Scenario 5: Pending payment booking
            new()
            {
                BookingReference = "BK-2026-5190",
                UserId = userMap["sophia.tran@gmail.com"].Id,
                FlightId = flightMap["SQ-178"].Id,
                TourId = tourMap["SQ-SIN-07"].Id,
                Route = "SGN -> SIN",
                CustomerName = "Sophia Tran",
                CustomerEmail = "sophia.tran@gmail.com",
                CustomerPhone = "+84 903 555 123",
                AdultsCount = 1,
                ChildrenCount = 0,
                TotalPrice = 520.00m,
                DiscountAmount = 0.00m,
                BaggagePackage = "NONE",
                BaggageFee = 0.00m,
                PaymentMethod = "AIRPORT_COUNTER",
                BookingStatus = "PENDING",
                Notes = "Chờ hành khách thanh toán trực tiếp tại quầy check-in sân bay Tân Sơn Nhất",
                CreatedAt = now.AddHours(-1)
            },
            // Scenario 6: High value Paris aviation booking
            new()
            {
                BookingReference = "BK-2026-4033",
                UserId = userMap["david.lee@outlook.com"].Id,
                FlightId = flightMap["AF-258"].Id,
                TourId = tourMap["AF-CDG-08"].Id,
                Route = "SGN -> CDG",
                CustomerName = "David Lee",
                CustomerEmail = "david.lee@outlook.com",
                CustomerPhone = "+84 934 667 890",
                AdultsCount = 1,
                ChildrenCount = 0,
                TotalPrice = 1720.00m,
                DiscountAmount = 0.00m,
                BaggagePackage = "EXTRA_30KG",
                BaggageFee = 40.00m,
                PaymentMethod = "CREDIT_CARD",
                BookingStatus = "PAID",
                Notes = "Hạng thương gia, yêu cầu đón xe Limousine riêng tại CDG Terminal 2E",
                CreatedAt = now.AddDays(-1)
            }
        };

        foreach (var seed in bookingSeeds)
        {
            if (!bookingMap.TryGetValue(seed.BookingReference, out var existing))
            {
                await context.Bookings.AddAsync(seed);
                bookingMap[seed.BookingReference] = seed;
            }
            else
            {
                existing.BaggagePackage = seed.BaggagePackage;
                existing.BaggageFee = seed.BaggageFee;
                existing.RefundAmount = seed.RefundAmount;
                existing.CancellationReason = seed.CancellationReason;
                existing.CancellationDate = seed.CancellationDate;
                context.Bookings.Update(existing);
            }
        }
        await context.SaveChangesAsync();

        existingBookings = await context.Bookings.ToListAsync();
        bookingMap = existingBookings.ToDictionary(b => b.BookingReference, b => b);

        // =====================================================================
        // 10. SEED PASSENGERS & SEAT ASSIGNMENTS
        // =====================================================================
        if (!await context.Passengers.AnyAsync(p => p.BookingId == bookingMap["BK-2026-9214"].Id))
        {
            var p1 = new Passenger
            {
                BookingId = bookingMap["BK-2026-9214"].Id,
                FullName = "Sophia Tran",
                IdOrPassport = "C99887766",
                Gender = "FEMALE",
                PassengerType = "ADULT",
                SelectedSeat = "2B"
            };
            var p2 = new Passenger
            {
                BookingId = bookingMap["BK-2026-4033"].Id,
                FullName = "David Lee",
                IdOrPassport = "US44556677",
                Gender = "MALE",
                PassengerType = "ADULT",
                SelectedSeat = "1A"
            };
            await context.Passengers.AddRangeAsync(new[] { p1, p2 });
            await context.SaveChangesAsync();
        }

        // =====================================================================
        // 11. SEED COUPONS
        // =====================================================================
        var existingCoupons = await context.Coupons.ToListAsync();
        var couponMap = existingCoupons.ToDictionary(c => c.Code, c => c);

        var couponSeeds = new List<Coupon>
        {
            new()
            {
                Code = "FLYSUMMER",
                Description = "Khuyến mãi hè hàng không - Giảm 10% tổng giá trị đặt tour",
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
                Description = "Giảm trực tiếp $25 cho mọi tour du lịch nội địa",
                DiscountAmount = 25.00m,
                MinSpend = 100.00m,
                ValidUntil = now.AddMonths(3),
                UsageCount = 42,
                IsActive = true
            },
            new()
            {
                Code = "AEROEXCLUSIVE",
                Description = "Đặc quyền bay độc quyền - Giảm ngay $50 cho đơn từ $400",
                DiscountAmount = 50.00m,
                MinSpend = 400.00m,
                ValidUntil = now.AddMonths(4),
                UsageCount = 12,
                IsActive = true
            },
            new()
            {
                Code = "OPERATORVIP",
                Description = "Ưu đãi đối tác lữ hành hàng không - Giảm 15% gói tour cao cấp",
                DiscountPercent = 15.00m,
                MinSpend = 500.00m,
                MaxDiscount = 120.00m,
                ValidUntil = now.AddMonths(5),
                UsageCount = 7,
                IsActive = true
            }
        };

        foreach (var seed in couponSeeds)
        {
            if (!couponMap.TryGetValue(seed.Code, out _))
            {
                await context.Coupons.AddAsync(seed);
                couponMap[seed.Code] = seed;
            }
        }
        await context.SaveChangesAsync();

        // =====================================================================
        // 12. SEED ARTICLES (Quản lý bởi Admin)
        // =====================================================================
        var existingArticles = await context.Articles.ToListAsync();
        var articleMap = existingArticles.ToDictionary(a => a.Slug, a => a);

        var articleSeeds = new List<Article>
        {
            new()
            {
                AuthorId = adminUser.Id,
                Slug = "airport-transit-guide-2026",
                Title = "Cẩm nang thủ tục bay & Fast-Track ga quốc tế Tân Sơn Nhất (SGN)",
                Summary = "Hướng dẫn chi tiết thủ tục check-in, làn an ninh ưu tiên SkyPriority và trải nghiệm phòng chờ thương gia Bông Sen ga T2.",
                Content = "Cảng hàng không quốc tế Tân Sơn Nhất đón tiếp hàng triệu lượt khách mỗi năm. Để có trải nghiệm bay mượt mà nhất trong mùa cao điểm, hành khách nên làm thủ tục trực tuyến trước 24 giờ...",
                CoverImage = "https://images.unsplash.com/photo-1542296332-2e4473faf563",
                AuthorName = "Chief Flight Administrator",
                AuthorRole = "Admin Quản Trị Hệ Thống",
                Category = "AIRPORT_GUIDE",
                ReadTimeMinutes = 5,
                TagsJson = "[\"Sân Bay SGN\",\"Fast-Track\",\"Phòng Chờ Thương Gia\",\"SkyPriority\"]",
                PublishedAt = now.AddDays(-2)
            },
            new()
            {
                AuthorId = adminUser.Id,
                Slug = "carry-on-luggage-regulations",
                Title = "Quy định mới nhất 2026 về Hành lý ký gửi & Pin Lithium sạc dự phòng",
                Summary = "Danh mục vật phẩm cấm bay, định mức dung lượng pin sạc dự phòng theo tiêu chuẩn ICAO và quy định phụ thu hành lý quá cước.",
                Content = "Tổ chức Hàng không Dân dụng Quốc tế (ICAO) và Cục Hàng không Việt Nam quy định nghiêm ngặt: mọi thiết bị pin sạc dự phòng lithium-ion phải được vận chuyển trong hành lý xách tay, nghiêm cấm để trong hành lý ký gửi...",
                CoverImage = "https://images.unsplash.com/photo-1569154941061-e231b4725ef1",
                AuthorName = "Chief Flight Administrator",
                AuthorRole = "Admin Quản Trị Hệ Thống",
                Category = "FLIGHT_TIPS",
                ReadTimeMinutes = 6,
                TagsJson = "[\"Quy Định Hành Lý\",\"Pin Lithium\",\"An Toàn Bay\",\"IATA 2026\"]",
                PublishedAt = now.AddDays(-5)
            },
            new()
            {
                AuthorId = adminUser.Id,
                Slug = "top-summer-aviation-tours-2026",
                Title = "Top 5 Tour du lịch hàng không độc quyền bùng nổ mùa hè 2026",
                Summary = "Khám phá các hải trình bay thẳng đẳng cấp đến Đà Nẵng, Phú Quốc, Tokyo và Paris được tối ưu lịch trình bởi các Tour Operator hàng đầu.",
                Content = "Du lịch bằng phương tiện hàng không độc quyền đang trở thành xu hướng dẫn đầu nhờ tiết kiệm thời gian, dịch vụ nghỉ dưỡng trọn gói từ lúc bước chân vào sảnh VIP sân bay cho đến khi hạ cánh...",
                CoverImage = "https://images.unsplash.com/photo-1503899036084-c55cdd92da26",
                AuthorName = "Chief Flight Administrator",
                AuthorRole = "Admin Quản Trị Hệ Thống",
                Category = "DESTINATION",
                ReadTimeMinutes = 4,
                TagsJson = "[\"Xu Hướng Du Lịch\",\"Tour Hàng Không\",\"Phú Quốc\",\"Tokyo\"]",
                PublishedAt = now.AddDays(-1)
            },
            new()
            {
                AuthorId = adminUser.Id,
                Slug = "online-checkin-and-seat-selection",
                Title = "Bí quyết chọn ghế đẹp & sơ đồ chỗ ngồi máy bay Boeing 787 & Airbus A350",
                Summary = "Cách nhận biết hàng ghế thoát hiểm rộng chân (Exit Row), hàng ghế đôi yên tĩnh và phương pháp làm thủ tục nhận thẻ lên tàu bay điện tử.",
                Content = "Lựa chọn một vị trí ghế ngồi ưng ý quyết định 80% độ thoải mái của cả chuyến bay. Trên các dòng máy bay thân rộng Airbus A350 và Boeing 787, dãy ghế thoát hiểm 14A, 14F luôn là sự lựa chọn ưu tiên...",
                CoverImage = "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf",
                AuthorName = "Chief Flight Administrator",
                AuthorRole = "Admin Quản Trị Hệ Thống",
                Category = "FLIGHT_TIPS",
                ReadTimeMinutes = 4,
                TagsJson = "[\"Chọn Ghế Ngồi\",\"Airbus A350\",\"Boeing 787\",\"Boarding Pass\"]",
                PublishedAt = now.AddDays(-3)
            }
        };

        foreach (var seed in articleSeeds)
        {
            if (!articleMap.TryGetValue(seed.Slug, out var existing))
            {
                await context.Articles.AddAsync(seed);
                articleMap[seed.Slug] = seed;
            }
            else
            {
                existing.Title = seed.Title;
                existing.Summary = seed.Summary;
                existing.Content = seed.Content;
                existing.AuthorRole = seed.AuthorRole;
                existing.CoverImage = seed.CoverImage;
                context.Articles.Update(existing);
            }
        }
        await context.SaveChangesAsync();
    }

    private static List<TourSeedDto> LoadTours100()
    {
        string? json = null;
        try
        {
            var assembly = typeof(DbInitializer).Assembly;
            using var stream = assembly.GetManifestResourceStream("Infrastructure.Data.tours100.json");
            if (stream != null)
            {
                using var reader = new StreamReader(stream);
                json = reader.ReadToEnd();
            }
        }
        catch { }

        if (string.IsNullOrEmpty(json))
        {
            string[] possiblePaths =
            [
                Path.Combine(AppContext.BaseDirectory, "Data", "tours100.json"),
                Path.Combine(AppContext.BaseDirectory, "tours100.json"),
                Path.Combine(Directory.GetCurrentDirectory(), "Infrastructure", "Data", "tours100.json"),
                Path.Combine(Directory.GetCurrentDirectory(), "backend", "Infrastructure", "Data", "tours100.json")
            ];

            foreach (var path in possiblePaths)
            {
                if (File.Exists(path))
                {
                    try
                    {
                        json = File.ReadAllText(path);
                        break;
                    }
                    catch { }
                }
            }
        }

        if (string.IsNullOrEmpty(json))
        {
            return new List<TourSeedDto>();
        }

        var options = new System.Text.Json.JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        return System.Text.Json.JsonSerializer.Deserialize<List<TourSeedDto>>(json, options) ?? new List<TourSeedDto>();
    }

    private class TourSeedDto
    {
        public string Code { get; set; } = string.Empty;
        public string DestinationCode { get; set; } = string.Empty;
        public string AirlineCode { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Subtitle { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal? OriginalPrice { get; set; }
        public int DurationDays { get; set; }
        public int DurationNights { get; set; }
        public string DepartureCity { get; set; } = "Ho Chi Minh City (SGN)";
        public string TransportType { get; set; } = "FLIGHT_EXCLUSIVE";
        public string FeaturedImage { get; set; } = string.Empty;
        public List<string>? GalleryImages { get; set; }
        public List<string>? Highlights { get; set; }
        public List<ItineraryDayDto>? Itinerary { get; set; }
        public string? BaggagePolicy { get; set; }
        public string? CancellationPolicy { get; set; }
        public double Rating { get; set; } = 4.8;
        public int ReviewsCount { get; set; } = 50;
        public string Status { get; set; } = "ACTIVE";
    }

    private class ItineraryDayDto
    {
        public int DayNumber { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<string>? Activities { get; set; }
        public string? Meals { get; set; }
        public string? Stay { get; set; }
    }
}
