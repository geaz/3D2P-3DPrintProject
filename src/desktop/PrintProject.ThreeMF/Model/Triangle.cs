namespace PrintProject.ThreeMF.Model
{
    public sealed class Triangle
    {
        public Triangle(sTriangle triangle)
        {
            V1 = triangle.Indices[0];
            V2 = triangle.Indices[1];
            V3 = triangle.Indices[2];
        }

        public uint V1 { get; }
        public uint V2 { get; }
        public uint V3 { get; }
    }
}
