using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AirportManagementSystem.Models
{
    public class Airline
    {
        public int Id { get; private set; }
        public string Name { get; set; }
        public string Country { get; set; }

        public Airline(int id, string name, string city)
        {
            Id = id;
            Name = name;
            Country = city;
        }

        // Display Col
        public List<string> AirlineColList()
        {
            return new List<string>
            {
                $"{"Id",-8}{"Name",-35}  {"Country",-15}"
            };
        }

        // Display Airline Information
        public String Display()
        {
            return string.Format(
                "{0,-6}  {1,-35}  {2,-15} |",
                this.Id,
                this.Name,
                this.Country
            );
        }
    }
}
