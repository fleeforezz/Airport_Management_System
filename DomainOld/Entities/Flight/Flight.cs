using Domain.Entities.Base;
using Domain.Enums;
using Domain.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities.Flight
{
    public class Flight : Entity
    {
        public FlightNumber FlightNumber { get; set; } = null!;
        public string AirlineName { get; set; } = string.Empty;
        public AircraftType AircraftType { get; set; }
        public FlightStatus Status { get; set; } = FlightStatus.Arrival;
        public string? AssignedStandId { get; set; }
        public string? AssignedRunwayId { get; set; }
        public decimal? ActualRevenue { get; set; }
        public string ContractId { get; set; } = string.Empty;
        public DateTime ContractExpiration { get; set; }
        public bool IsGroundServiceCompleted { get; set; }

        // Business Methods
        // This is where DDD really shines - Business logic sits on the entity itself, not in service

        /* Can assign stand only if:
         * Flight status = Arrival
         * No stand has been assigned yet
         */
        public bool CanAssigneStand() => 
            Status == FlightStatus.Arrival && string.IsNullOrEmpty(AssignedStandId);

        /* Can assign a runway only if:
         * Flight status = AssignedStand
         * No runway has been assigned yet
         */
        public bool CanAssignRunway() =>
            Status == FlightStatus.AssignedStand && string.IsNullOrEmpty(AssignedRunwayId);

        /* Flight can land only if:
         * Flight status = ReadyToLand
         * It has both stand and runway assigned (Check by HasRequiredAssignments())
         */
        public bool CanLand() =>
            Status == FlightStatus.ReadyToLand && HasRequiredAssignments();

        /* Flight can take off only if:
         * Flight status = ReadyForDeparture
         * Ground services are completed
         */
        public bool CanTakeOff() =>
            Status == FlightStatus.ReadyForDeparture && IsGroundServiceCompleted;

        // Helper method to check if both stand and runway are assigned
        private bool HasRequiredAssignments() =>
            !string.IsNullOrEmpty(AssignedStandId) && !string.IsNullOrEmpty(AssignedRunwayId);
    }
}
