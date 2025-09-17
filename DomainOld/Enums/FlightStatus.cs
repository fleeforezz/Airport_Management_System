using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Enums
{
    public enum FlightStatus
    {
        Arrival,
        AssignedStand,
        AssignedRunway,
        ReadyToLand,
        Landing,
        OnStand,
        GroundServiceInProgress,
        GroundServiceCompleted,
        ReadyForDeparture,
        TakingOff,
        Departure
    }
}
