using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

/*
    This FlightNumber record:
     + Represents a value object for flight numbers
     + Enforces validation rules at creation (no invalid flight numbers can exist)
     + Is immutable (once created, can't be changed)
     + Supports value equality and string converion
     + Provides a clean base class for domain models in a DDD-style (Domain-Driven Design) architechture
*/

namespace Domain.ValueObjects
{
    public record FlightNumber
    {
        public string Value {  get; }

        public FlightNumber(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                throw new ArgumentException("Flight number cannot be empty");
            }

            if (!IsValidFormat(value))
            {
                throw new ArgumentException($"Invalid flight number format: {value}");
            }

            Value = value.ToUpper().Trim();
        }

        private static bool IsValidFormat(string value)
        {
            // Format: 2-3 letters followed by 3-4 digits (e.g., BA123, VS3642)
            return System.Text.RegularExpressions.Regex.IsMatch(
                value, @"^[A-Za-z]{2,3}\d{3,4}$");
        }

        public static implicit operator string(FlightNumber flightNumber) => flightNumber.Value;
        public static implicit operator FlightNumber(string value) => new(value);  
    }
}
