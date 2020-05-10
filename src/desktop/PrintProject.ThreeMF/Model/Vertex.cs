namespace PrintProject.ThreeMF.Model
{
    public sealed class Vertex
    {
        public Vertex(sPosition position)
        {
            X = position.Coordinates[0];
            Y = position.Coordinates[1];
            Z = position.Coordinates[2];
        }

        public float X { get; }
        public float Y { get; }
        public float Z { get; }
    }
}
