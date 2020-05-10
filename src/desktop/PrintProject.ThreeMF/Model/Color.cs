namespace PrintProject.ThreeMF.Model
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
        public uint RessourceId { get; }

        /// <summary>
        /// Gets the property ID of the color within the ressource.
        /// </summary>
        public uint PropertyId { get; }

        public byte Alpha { get; }
        public byte Red { get; }
        public byte Green { get; }
        public byte Blue { get; }
    }
}
