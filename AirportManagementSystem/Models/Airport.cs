

namespace AirportManagementSystem.Models
{
    public class Airport
    {
        public int Id { get; private set; }
        public string Name { get; set; }
        public string City { get; set; }
        public string Country { get; set; }

        public Airport(int id, string name, string city, string country)
        {
            Id = id;
            Name = name;
            City = city;
            Country = country;
        }

        // Display Airport Information
        public String Display()
        {
            return string.Format(
                "| {0,-8} | {1,-35} | {2,-20} | {3,-15} |",
                this.Id,
                this.Name,
                this.City,
                this.Country
            );
        }
    }
}
