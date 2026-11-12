using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AirportManagementSystem.Models
{
    public class SeatAssignment
    {
        public int Id { get; private set; }
        public int BookingId { get; private set; }
        public int SeatId { get; private set; }

        public SeatAssignment(int id, int bookingId, int seatId)
        {
            Id = id;
            BookingId = bookingId;
            SeatId = seatId;
        }
    }
}
