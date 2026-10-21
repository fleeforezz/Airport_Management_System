using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AirportManagementSystem.Models
{
    public class Airport
    {
        public int Id { get; private set; }
        public string Name { get; private set; }
        public string City { get; private set; }
        public string Country { get; private set; }

        public Airport(int id, string name, string city, string country)
        {
            Id = id;
            Name = name;
            City = city;
            Country = country;
        }
    }
}
