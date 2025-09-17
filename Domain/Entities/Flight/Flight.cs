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
        public bool CanAssigneStand() => 
            Status == FlightStatus.Arrival && string.IsNullOrEmpty(AssignedStandId);

        public bool CanAssignRunway() =>
            Status == FlightStatus.AssignedStand && string.IsNullOrEmpty(AssignedRunwayId);

        public bool CanLand() =>
            Status == FlightStatus.ReadyToLand && HasRequiredAssignments();

        public bool CanTakeOff() =>
            Status = FlightStatus.ReadyForDeparture && IsGroundServiceCompleted;

        private bool HasRequiredAssignments() =>
            !string.IsNullOrEmpty(AssignedStandId) && !string.IsNullOrEmpty(AssignedRunwayId);
    }
}
