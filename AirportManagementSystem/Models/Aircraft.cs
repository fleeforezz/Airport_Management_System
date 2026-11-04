
namespace AirportManagementSystem.Models
{
    public class Aircraft
    {
        public int Id { get; private set; }
        public string RegistrationNumber { get; set; }
        public string Model { get; set; }
        public int Capacity { get; set; }
        public int AirlineId { get; set; } // Foreign key to Airline

        public Aircraft(int id, string model, string registrationNumber, int capacity,  int airlineId)
        {
            Id = id;
            RegistrationNumber = registrationNumber;
            Model = model;
            Capacity = capacity;
            AirlineId = airlineId;
        }

        // Display Col
        public List<string> AircraftColList()
        {
            return new List<string>
            {
                $"{"Id",-8}{"Registration Number",-35}  {"Model",-20}  {"Capacity",-10}   {"AirlineId", -8}"
            };
        }

        // Display Aircraft Information
        public String Display()
        {
            return string.Format(
                "{0,-6}  {1,-35}  {2,-20}  {3,-10}  {4,-10} |",
                this.Id,
                this.RegistrationNumber,
                this.Model,
                this.Capacity,
                this.AirlineId
            );
        }
    }
}
