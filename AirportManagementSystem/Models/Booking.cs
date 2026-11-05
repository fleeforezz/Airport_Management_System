using AirportManagementSystem.Models.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AirportManagementSystem.Models
{
    public class Booking
    {
        public int Id { get; private set; }
        public string BookingReference { get; private set; }

        public int PassengerId { get; private set; }
        public int FlightId { get; private set; }

        public DateTime BookingDate { get; private set; }

        public BookingStatus Status { get; private set; }

        public decimal TotalPrice { get; private set; }

        public Booking(
            int id,
            string bookingReference,
            int passengerId,
            int flightId,
            decimal totalPrice)
        {
            if (totalPrice < 0)
                throw new ArgumentOutOfRangeException(nameof(totalPrice));

            Id = id;
            BookingReference = bookingReference;
            PassengerId = passengerId;
            FlightId = flightId;
            TotalPrice = totalPrice;
            BookingDate = DateTime.UtcNow;
            Status = BookingStatus.Confirmed;
        }

        public void Cancel()
        {
            if (Status == BookingStatus.Cancelled)
                throw new InvalidOperationException(
                    "Booking is already cancelled.");

            Status = BookingStatus.Cancelled;
        }
    }
}
