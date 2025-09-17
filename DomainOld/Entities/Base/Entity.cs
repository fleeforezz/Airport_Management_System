using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

/*
    This Entity class:
     + Provides a unique ID for each entity.
     + Tracks creation and last update times.
     + Allows subclass to hook into update time events (OnUpdated)
     + Implements value-based equality (Based on ID, not memory reference)
     + Provides a clean base class for domain models in a DDD-style (Domain-Driven Design) architechture
*/


namespace Domain.Entities.Base
{
    public abstract class Entity
    {
        // This ensure every entity has an ID and tracking timestamps out of the box
        public string Id {  get; set; } = Guid.NewGuid().ToString();
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set;} = DateTime.UtcNow;

        // If a subclass overrides this, it could also trigger events, validations, or logging
        protected virtual void OnUpdated()
        {
            UpdatedAt = DateTime.UtcNow;
        }

        // Overrides Equals so that two entities are considered equal if they share the same Id.
        public override bool Equals(object? obj)
        {
            if (obj is not Entity other)
            {
                return false;
            }

            return Id == other.Id;
        }

        // This keeps Entity consistent with the Equals method 
        public override int GetHashCode()
        {
            return Id.GetHashCode();
        }
    }
}
