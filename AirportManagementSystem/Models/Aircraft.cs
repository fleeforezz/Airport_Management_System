using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AirportManagementSystem.Models
{
    public class Aircraft
    {
        public int Id { get; private set; }
        public string RegistrationNumber { get; set; }
        public string Model { get; set; }
        public int Capacity { get; set; }
        public int AirlineId { get; set; } // Foreign key to Airline

        public Aircraft(int id, string model, string registrationNumber, int capacity)
        {
            Id = id;
            Model = model;
            RegistrationNumber = registrationNumber;
            Capacity = capacity;
        }

        // Display Col
        public List<string> AircraftColList()
        {
            return new List<string>
            {
                $"{"Id",-8}{"Model",-35}  {"Registration Number",-20}  {"Capacity",-10}"
            };
        }

        // Display Aircraft Information
        public String Display()
        {
            return string.Format(
                "{0,-6}  {1,-35}  {2,-20}  {3,-10} |",
                this.Id,
                this.Model,
                this.RegistrationNumber,
                this.Capacity
            );
        }
    }
}
