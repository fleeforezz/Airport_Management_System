using AirportManagementSystem.Models.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AirportManagementSystem.Models
{
    public class User
    {
        public int Id { get; private set; }
        public string Username { get; private set; }
        public UserRole Role { get; private set; }

        public User(int id, string username, UserRole role)
        {
            Id = id;
            Username = username;
            Role = role;
        }
    }
}
