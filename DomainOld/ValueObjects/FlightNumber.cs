using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ValueObjects
{
    /// <summary>
    /// This FlightNumber record:
    /// + Represents a value object for flight numbers 
    /// + Enforces validation rules at creation (no invalid flight numbers can exist)
    /// + Is immutable (once created, can't be changed)
    /// + Supports value equality and string converion
    /// + Provides a clean base class for domain models in a DDD-style (Domain-Driven Design) architechture
    /// </summary>

    public record FlightNumber // Record is like a class but made for immutable data objects
    {
        // A readonly property
        // Once set and cannot be changed (Immutability)
        public string Value {  get; } 

        // Constructor with validation
        public FlightNumber(string value)
        {
            // Ensure the string is not empty or whitespace
            if (string.IsNullOrWhiteSpace(value))
            {
                throw new ArgumentException("Flight number cannot be empty");
            }

            // Ensure the string matches the expected flight number format
            if (!IsValidFormat(value))
            {
                throw new ArgumentException($"Invalid flight number format: {value}");
            }

            // Uppercase and remove start/end flight number space
            Value = value.ToUpper().Trim();
        }

        // Validation method
        private static bool IsValidFormat(string value)
        {
            // Format: 2-3 letters followed by 3-4 digits (e.g., BA123, VS3642)
            return System.Text.RegularExpressions.Regex.IsMatch(
                value, @"^[A-Za-z]{2,3}\d{3,4}$");
        }

        // Lets you automatically convert between FlightNumber and string
        /* Usage:
            FlightNumber fn = "ba123";
            string s = fn;
         */
        public static implicit operator string(FlightNumber flightNumber) => flightNumber.Value;
        public static implicit operator FlightNumber(string value) => new(value);  
    }
}
