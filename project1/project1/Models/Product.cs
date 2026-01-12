using System.ComponentModel.DataAnnotations;

namespace project1.Models
{
    public class Product
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "اسم المنتج مطلوب")]
        public string Name { get; set; }

        [Required(ErrorMessage = "السعر مطلوب")]
        [Range(1, 10000, ErrorMessage = "السعر يجب أن يكون بين 1 و 10000")]
        public decimal Price { get; set; }

        public string Description { get; set; }
    }
}
