using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AirportManagementSystem.Models
{
    public class Seat
    {
        public int Id { get; private set; }
        public int AircraftId { get; private set; }

        public string SeatNumber { get; private set; }
        public string Class { get; private set; }

        public Seat(
            int id,
            int aircraftId,
            string seatNumber,
            string seatClass)
        {
            Id = id;
            AircraftId = aircraftId;
            SeatNumber = seatNumber;
            Class = seatClass;
        }
    }
}
