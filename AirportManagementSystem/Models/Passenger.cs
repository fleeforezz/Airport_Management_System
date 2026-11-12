using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AirportManagementSystem.Models
{
    public class Passenger
    {
        public int Id { get; private set; }
        public string FullName { get; private set; }
        public DateTime DateOfBirth { get; private set; }
        public string Email { get; private set; }
        public string PassportNumber { get; private set; }

        public Passenger(
            int id,
            string fullName,
            DateTime dateOfBirth,
            string email,
            string passportNumber)
        {
            Id = id;
            FullName = fullName;
            DateOfBirth = dateOfBirth;
            Email = email;
            PassportNumber = passportNumber;
        }
    }
}
