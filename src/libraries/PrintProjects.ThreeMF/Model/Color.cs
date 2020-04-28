namespace PrintProjects.ThreeMF.Model
{
    public sealed class Color
    {
        public Color(uint resId, uint propId, sColor color)
        {
            RessourceId = resId;
            PropertyId = propId;

            Alpha = color.Alpha;
            Red = color.Red;
            Green = color.Green;
            Blue = color.Blue;
        }

        /// <summary>
        /// Gets the ressource ID of the ressource where the color is defined.
        /// </summary>
        public uint RessourceId { get; private set; }

        /// <summary>
        /// Gets the property ID of the color within the ressource.
        /// </summary>
        public uint PropertyId { get; private set; }
        
        public byte Alpha { get; private set; }
        public byte Red { get; private set; }
        public byte Green { get; private set; }
        public byte Blue { get; private set; }
    }
}
