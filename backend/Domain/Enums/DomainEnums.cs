namespace Domain.Enums;

public enum FlightStatus
{
    SCHEDULED,
    ON_TIME,
    BOARDING,
    DEPARTED,
    DELAYED,
    CANCELLED
}

public enum BookingStatus
{
    PENDING,
    CONFIRMED,
    PAID,
    COMPLETED,
    CANCELLED
}

public enum UserRole
{
    USER,
    DISPATCHER,
    AIRPORT_STAFF,
    ADMIN
}

public enum PassengerType
{
    ADULT,
    CHILD,
    INFANT
}

public enum SeatClass
{
    ECONOMY,
    PREMIUM_ECONOMY,
    BUSINESS,
    FIRST
}

public enum PaymentMethod
{
    CREDIT_CARD,
    BANK_TRANSFER,
    ZALO_PAY,
    AIRPORT_COUNTER
}

public enum PaymentStatus
{
    PENDING,
    SUCCESS,
    FAILED,
    REFUNDED
}
