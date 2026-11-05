using AirportManagementSystem.Models.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AirportManagementSystem.Models
{
    public class Payment
    {
        public int Id { get; private set; }
        public int BookingId { get; private set; }

        public decimal Amount { get; private set; }
        public PaymentMethod Method { get; private set; }
        public PaymentStatus Status { get; private set; }

        public DateTime CreatedAt { get; private set; }

        public Payment(
            int id,
            int bookingId,
            decimal amount,
            PaymentMethod method)
        {
            if (amount <= 0)
                throw new ArgumentOutOfRangeException(nameof(amount));

            Id = id;
            BookingId = bookingId;
            Amount = amount;
            Method = method;
            Status = PaymentStatus.Pending;
            CreatedAt = DateTime.UtcNow;
        }
    }
}
