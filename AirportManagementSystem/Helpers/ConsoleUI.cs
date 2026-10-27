
namespace AirportManagementSystem.Helpers
{
    public class ConsoleUI
    {
        private const int Padding = 3;


        /*
        ###############################
        Show Header
        ###############################
         */
        public static void ShowHeader(string title)
        {
            int width = Math.Max(title.Length + 4, 45);

            string border = new string('=', width);

            Console.WriteLine();
            Console.WriteLine($"   {border}");
            Console.WriteLine($"   {title.PadLeft((width + title.Length) / 2).PadRight(width)}");
            Console.WriteLine($"   {border}");
            Console.WriteLine();
        }


        /*
        ###############################
        Show Menu
        ###############################
         */
        public static void ShowMenu(IReadOnlyList<string> options)
        {
            if (options.Count == 0)
            {
                Console.WriteLine("No options available.");
                return;
            }

            int numberWidth = options.Count.ToString().Length;
            int labelWidth = Math.Max(30, options.Max(option => option.Length));

            Console.WriteLine($"   {"#".PadLeft(numberWidth + 1)}   {"Options".PadRight(labelWidth)}");
            Console.WriteLine($"   {new string('-', numberWidth + 1)}   {new string('-', labelWidth)}");

            for (int i = 0; i < options.Count; i++)
            {
                Console.WriteLine($"   {(i + 1).ToString().PadLeft(numberWidth + 1)}   {options[i]}");
            }

            Console.WriteLine();
        }


        /*
        ###############################
        Read User Choice
        ###############################
         */
        public static int ReadUserChoice(int min, int max)
        {
            while (true)
            {
                Console.Write($"   Enter your choice: ");
                
                string? input = Console.ReadLine();

                if (int.TryParse(input, out int choice) && choice >= min && choice <= max)
                {
                    return choice;
                }

                Console.WriteLine($"Invalid input. Please enter a number between {min} and {max}.");
                Console.WriteLine();
            }
        }


        /*
        ###############################
        Show separator
        ###############################
         */
        public static void ShowSeparator(int width = 45)
        {
            Console.WriteLine($"   {new string('-', width)}");
        }


        /*
        ###############################
        Pause for User Input
        ###############################
         */
        public static void PauseForUserInput()
        {
            Console.WriteLine();
            Console.Write("   Press any key to continue...");
            Console.ReadKey();
            Console.WriteLine();
        }


        /*
        ###############################
        Clear Console
        ###############################
         */
        public static void ClearConsole()
        {
            Console.Clear();
        }
    }
}
