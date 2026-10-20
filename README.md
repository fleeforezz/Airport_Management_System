# ✈️ Airport Booking System

A C# Console Application for practicing Object-Oriented Programming (OOP), file handling, data management, and software design through an airport and flight booking management system.

This project is built as a series of **10 progressive exercises**, from beginner to advanced. Each exercise introduces new requirements and builds upon the previous one.

## 🎯 Project Goals

- Practice C# fundamentals and Object-Oriented Programming.
- Learn how to design classes, interfaces, and relationships between objects.
- Manage collections using `List<T>`, `Dictionary<TKey, TValue>`, and LINQ.
- Read and write local JSON files for persistent data storage.
- Implement CRUD operations (Create, Read, Update, Delete).
- Practice input validation, exception handling, and business rules.
- Learn separation of concerns and maintainable project structure.
- Write unit tests for important business logic.

## 🛠️ Technologies

- **Language:** C#
- **Application Type:** Console Application
- **Framework:** .NET
- **Storage:** Local JSON files
- **Serialization:** `System.Text.Json`
- **Testing:** xUnit, NUnit, or MSTest (introduced in later exercises)
- **Version Control:** Git

## 📚 Exercise Roadmap

### Level 1 — Beginner

#### Exercise 1: Airport Information Management

**Objective:** Practice classes, objects, properties, methods, and basic file handling.

Requirements:
- Create an `Airport` class with `Id`, `Name`, `City`, and `Country`.
- Add, display, search, update, and delete airports.
- Save airport data to `airports.json`.
- Load existing data when the application starts.
- Handle missing files and invalid user input.

**Completion criteria:** Airport records persist after the application closes and restarts.

#### Exercise 2: Airline & Aircraft Management

**Objective:** Practice collections and relationships between objects.

Requirements:
- Create `Airline` and `Aircraft` classes.
- Store airline details and aircraft information.
- Assign aircraft to airlines.
- Prevent duplicate aircraft registrations.
- Save data to `airlines.json` and `aircraft.json`.

**Completion criteria:** Display each airline and its assigned aircraft.

#### Exercise 3: Flight Schedule Management

**Objective:** Practice object relationships, dates, and validation.

Requirements:
- Create a `Flight` class.
- Associate flights with origin and destination airports, an airline, and an aircraft.
- Validate departure and arrival times.
- Search flights by origin, destination, and date.
- Update or cancel scheduled flights.
- Save flight data to `flights.json`.

**Completion criteria:** Search for flights between two airports on a selected date.

### Level 2 — Intermediate

#### Exercise 4: Passenger Management

**Objective:** Practice CRUD operations and data validation.

Requirements:
- Create a `Passenger` class with passenger ID, full name, date of birth, email, and passport number.
- Register, view, search, update, and delete passenger records.
- Prevent duplicate passenger IDs and passport numbers.
- Validate required fields and email format.
- Save data to `passengers.json`.

**Completion criteria:** Manage passenger records without creating duplicate identities.

#### Exercise 5: Flight Booking System

**Objective:** Combine multiple classes into a complete workflow.

Requirements:
- Create a `Booking` class.
- Associate bookings with passengers and flights using IDs.
- Generate unique booking references.
- Create, view, and cancel bookings.
- Prevent duplicate active bookings for the same passenger and flight.
- Save data to `bookings.json`.

**Completion criteria:** Create a booking, restart the application, and retrieve it using its booking reference.

#### Exercise 6: Seat Selection & Capacity

**Objective:** Practice collections, state management, and business rules.

Requirements:
- Represent aircraft seats using labels such as `1A`, `1B`, and `2A`.
- Display available and occupied seats.
- Assign seats to bookings.
- Prevent two active bookings from occupying the same seat on a flight.
- Release seats when bookings are cancelled.
- Enforce aircraft seating capacity.

**Completion criteria:** Prevent duplicate seat assignments and correctly release seats after cancellation.

#### Exercise 7: Ticket Pricing & Payments

**Objective:** Practice interfaces, enums, and business logic.

Requirements:
- Implement Economy and Business fare types.
- Calculate ticket prices based on fare type.
- Apply discounts and promotional codes.
- Track payment statuses such as `Pending`, `Paid`, and `Refunded`.
- Prevent invalid payment status transitions.
- Record payments in `payments.json`.

**Completion criteria:** Calculate a ticket price, apply a discount, simulate payment, and persist the result.

### Level 3 — Advanced

#### Exercise 8: Advanced Flight Search

**Objective:** Practice LINQ, sorting, filtering, and reusable queries.

Requirements:
- Search by origin, destination, date, and passenger count.
- Filter by airline, price, and available seats.
- Sort results by price, departure time, or flight duration.
- Find the cheapest and shortest-duration flights.
- Optionally support connecting flights with one stop.

**Completion criteria:** Return accurate search results for multiple filter combinations.

#### Exercise 9: Admin & Booking Management

**Objective:** Practice authorization, interfaces, exception handling, and data consistency.

Requirements:
- Introduce Admin and Passenger roles.
- Restrict administrative operations to authorized users.
- Allow passengers to manage only their own bookings.
- Record important operations in `logs.json`.
- Handle corrupted JSON files and failed file writes.
- Keep booking, seat, and payment data consistent when operations fail.
- Introduce repository interfaces such as `IRepository<T>`.

**Completion criteria:** Enforce permissions and handle errors without leaving inconsistent records.

#### Exercise 10: Complete Airport Booking System

**Objective:** Integrate all features into a maintainable application.

Requirements:
- Integrate airport, airline, aircraft, flight, passenger, booking, seat, and payment management.
- Support flight statuses such as `Scheduled`, `Delayed`, `Departed`, `Arrived`, and `Cancelled`.
- Handle flight rescheduling and cancellation consistently.
- Generate passenger lists, flight occupancy reports, revenue reports, and cancellation reports.
- Implement local data backup and restore.
- Write unit tests for booking, seat assignment, cancellation, and payment rules.
- Refactor duplicate code and document design decisions.

**Completion criteria:** Run a complete scenario from creating a flight through booking, payment, seat assignment, cancellation, and reporting.

## 🏗️ Suggested Project Structure

Start with a single Console App project. Organize the code into folders as the project grows.

```text
AirportBookingSystem/
├── AirportBookingSystem.csproj
├── Program.cs
│
├── Models/
│   ├── Airport.cs
│   ├── Airline.cs
│   ├── Aircraft.cs
│   ├── Flight.cs
│   ├── Passenger.cs
│   ├── Booking.cs
│   └── Payment.cs
│
├── Services/
│   ├── AirportService.cs
│   ├── FlightService.cs
│   ├── PassengerService.cs
│   ├── BookingService.cs
│   └── PaymentService.cs
│
├── Repositories/
│   ├── IRepository.cs
│   └── JsonRepository.cs
│
├── Data/
│   ├── airports.json
│   ├── airlines.json
│   ├── aircraft.json
│   ├── flights.json
│   ├── passengers.json
│   ├── bookings.json
│   └── payments.json
│
└── Tests/
    └── AirportBookingSystem.Tests/
```

The structure is a guideline, not a requirement to implement everything immediately. Introduce classes and folders when they become useful.

## 💾 Local Data Storage

The application uses local JSON files instead of a database.

Example `airports.json`:

```json
[
  {
    "Id": 1,
    "Name": "Noi Bai International Airport",
    "City": "Hanoi",
    "Country": "Vietnam"
  },
  {
    "Id": 2,
    "Name": "Tan Son Nhat International Airport",
    "City": "Ho Chi Minh City",
    "Country": "Vietnam"
  }
]
```

Use `System.Text.Json` to serialize and deserialize objects.

Recommended practices:

- Load data when the application starts.
- Save changes whenever appropriate.
- Handle missing or invalid files.
- Use stable IDs to connect related records.
- Keep file-handling logic separate from business logic.
- Store data in a predictable directory.
- Consider backups and recovery when implementing advanced exercises.

**Important:** JSON files are suitable for this learning project, but they do not automatically provide database transactions or safe concurrent access.

## 🧠 Concepts to Practice

| Concept | Where to practice |
|---|---|
| Classes and objects | Exercises 1–10 |
| Encapsulation | Exercises 1–10 |
| Collections | Exercises 2–8 |
| Relationships between classes | Exercises 2–6 |
| Inheritance and interfaces | Exercises 7–9 |
| Enums and validation | Exercises 3–7 |
| LINQ | Exercise 8 |
| File I/O and JSON | Exercises 1–10 |
| Exception handling | Exercises 1, 9, and 10 |
| Separation of concerns | Exercises 5–10 |
| Dependency inversion | Exercises 9–10 |
| Unit testing | Exercise 10 |

## 📋 Development Rules

To get the most out of this project:

1. Implement each exercise yourself before looking for a solution.
2. Complete the current exercise's requirements before moving to the next.
3. Keep `Program.cs` focused on application startup and menu navigation.
4. Put business rules in appropriate classes or services.
5. Validate user input and handle expected errors.
6. Test persistence by restarting the application.
7. Refactor earlier code when new concepts become available.
8. Commit your work to Git after completing each exercise.

## 🚀 Getting Started

### Prerequisites

- Install a supported .NET SDK.
- Install Visual Studio or Visual Studio Code with C# support.
- Have basic knowledge of C# syntax, variables, conditions, loops, methods, and classes.

### Create the project

Open a terminal and run:

```bash
dotnet new console -n AirportBookingSystem
cd AirportBookingSystem
dotnet run
```

### Start Exercise 1

Implement the following features first:

1. Create the `Airport` model.
2. Display a console menu.
3. Add an airport.
4. Display all airports.
5. Search for an airport by ID.
6. Update an airport.
7. Delete an airport.
8. Save and load airport records using JSON.

Do not start with all ten exercises at once. Build the application incrementally.

## ✅ Overall Project Completion

The project is complete when:

- [ ] All ten exercises have been implemented.
- [ ] Data persists across application restarts.
- [ ] Invalid input and expected file errors are handled.
- [ ] Booking and seat assignment rules are enforced.
- [ ] Payment and cancellation workflows work correctly.
- [ ] Administrative permissions are enforced.
- [ ] Reports return correct results.
- [ ] Unit tests cover the most important business rules.
- [ ] The code is organized, readable, and maintainable.

## 📌 Final Note

This is a learning project, not a production airline reservation system. Focus on understanding the design decisions behind each feature rather than simply making the application work.

**Recommended starting point:** Complete Exercise 1 before introducing additional models, services, or abstractions. A solid foundation will make the more complex exercises easier to understand and implement.
