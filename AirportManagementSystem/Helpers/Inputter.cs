using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AirportManagementSystem.Helpers
{
    public class Inputter
    {
        // Get String (no empty index)
        public static string GetStringValue(String prompt, String emptyMessage)
        {
            while (true)
            {
                Console.Write(prompt);
                string input = Console.ReadLine();
                if (!string.IsNullOrWhiteSpace(input))
                {
                    return input;
                }
                else
                {
                    Console.WriteLine(emptyMessage);
                }
            }
        }

        // Get Integer (no empty index)
        public static int GetIntValue(
            String prompt, 
            int minValue, int maxValue,
            bool allowEmpty
            )
        {
            while (true)
            {
                Console.Write(prompt);
                string input = Console.ReadLine();
                if (!string.IsNullOrWhiteSpace(input) && int.TryParse(input, out int value))
                {
                    if (value >= minValue && value <= maxValue)
                    {
                        return value;
                    }
                    else
                    {
                        Console.WriteLine($"Please enter a value between {minValue} and {maxValue}.");
                    }
                }
                else
                {
                    Console.WriteLine(emptyMessage);
                }
            }
        }
    }
}
